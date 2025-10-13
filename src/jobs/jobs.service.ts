import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Job } from './entities/job.entity';
import { JobApplication } from './entities/job-application.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ApplyForJobDto } from './dto/apply-for-job.dto';
import { SearchJobDto } from './dto/search-job.dto';
import { JobStatus, JobType } from './entities/job.entity';
import { ApplicationStatus } from './entities/job-application.entity';
import { User } from '../users/entities/user.entity';
import { Journalist } from '../journalists/entities/journalist.entity';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(JobApplication)
    private readonly jobApplicationRepository: Repository<JobApplication>,
    @InjectRepository(Journalist)
    private readonly journalistRepository: Repository<Journalist>,
  ) {}

  async create(createJobDto: CreateJobDto, user: User): Promise<Job> {
    const job = this.jobRepository.create(createJobDto);
    return this.jobRepository.save(job);
  }

  async findAll(searchDto?: SearchJobDto): Promise<Job[]> {
    const queryBuilder = this.jobRepository.createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company')
      .leftJoinAndSelect('job.jobMediaWorkTypes', 'jobMediaWorkType')
      .leftJoinAndSelect('job.jobRequiredSkills', 'jobRequiredSkill')
      .leftJoinAndSelect('job.jobRequiredLanguages', 'jobRequiredLanguage')
      .leftJoinAndSelect('job.jobLocations', 'jobLocation')
      .where('job.status = :status', { status: JobStatus.PUBLISHED });

    // Apply filters from SearchJobDto using junction tables
    if (searchDto?.location) {
      queryBuilder.andWhere('jobLocation.location LIKE :location', { location: `%${searchDto.location}%` });
    }

    if (searchDto?.mediaWorkType) {
      queryBuilder.andWhere('jobMediaWorkType.mediaWorkType = :mediaWorkType', { mediaWorkType: searchDto.mediaWorkType });
    }

    if (searchDto?.jobType) {
      queryBuilder.andWhere('job.jobType = :jobType', { jobType: searchDto.jobType });
    }

    if (searchDto?.analystSpecialty) {
      queryBuilder.andWhere('jobMediaWorkType.mediaWorkType = :analystSpecialty', { analystSpecialty: searchDto.analystSpecialty });
    }

    if (searchDto?.skills && searchDto.skills.length > 0) {
      queryBuilder.andWhere('jobRequiredSkill.skill IN (:...skills)', { skills: searchDto.skills });
    }

    if (searchDto?.languages && searchDto.languages.length > 0) {
      queryBuilder.andWhere('jobRequiredLanguage.language IN (:...languages)', { languages: searchDto.languages });
    }

    queryBuilder.orderBy('job.createdAt', 'DESC');

    if (searchDto?.limit) {
      queryBuilder.limit(searchDto.limit);
    }

    if (searchDto?.offset) {
      queryBuilder.offset(searchDto.offset);
    }

    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Job> {
    const job = await this.jobRepository.findOne({
      where: { id },
      relations: ['company', 'applications'],
    });

    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    return job;
  }

  async findByCompany(companyId: number): Promise<Job[]> {
    return this.jobRepository.find({
      where: { company: { id: companyId } },
      relations: ['company', 'applications'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, updateJobDto: UpdateJobDto, user: User): Promise<Job> {
    const job = await this.findOne(id);
    
    // Check if user owns this job's company
    if (job.company.user.id !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You can only update jobs from your own company');
    }
    
    Object.assign(job, updateJobDto);
    return this.jobRepository.save(job);
  }

  async remove(id: number, user: User): Promise<void> {
    const job = await this.findOne(id);
    
    // Check if user owns this job's company
    if (job.company.user.id !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You can only delete jobs from your own company');
    }
    
    await this.jobRepository.remove(job);
  }

  async applyForJob(jobId: number, applyDto: ApplyForJobDto, user: User): Promise<JobApplication> {
    const { coverLetter, resumeUrl, resumeFilename, resumeSize, portfolio, samples, proposedRate, availableStartDate, availability, answers, references, equipment, experience, education, notes } = applyDto;

    const job = await this.findOne(jobId);
    
    if (job.status !== JobStatus.PUBLISHED) {
      throw new BadRequestException('Job is not available for applications');
    }

    // Resolve journalist by current user
    const journalist = await this.journalistRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (!journalist) {
      throw new BadRequestException('Only journalists can apply for jobs');
    }

    // Check if already applied
    const existingApplication = await this.jobApplicationRepository.findOne({
      where: { job: { id: jobId }, journalist: { id: journalist.id } },
    });

    if (existingApplication) {
      throw new BadRequestException('You have already applied for this job');
    }

    const application = this.jobApplicationRepository.create({
      job,
      journalist,
      company: job.company,
      coverLetter,
      resumeUrl,
      resumeFilename,
      resumeSize,
      portfolio,
      samples,
      proposedRate,
      availableStartDate,
      availability,
      answers,
      references,
      equipment,
      experience,
      education,
      notes,
      status: ApplicationStatus.PENDING,
    });

    const savedApplication = await this.jobApplicationRepository.save(application);

    // Update job applications count
    job.applicationsCount += 1;
    await this.jobRepository.save(job);

    return savedApplication;
  }

  async getApplicationsByJob(jobId: number): Promise<JobApplication[]> {
    return this.jobApplicationRepository.find({
      where: { job: { id: jobId } },
      relations: ['journalist', 'journalist.user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getApplicationsByJournalist(journalistId: number): Promise<JobApplication[]> {
    return this.jobApplicationRepository.find({
      where: { journalist: { id: journalistId } },
      relations: ['job', 'job.company'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateApplicationStatus(
    applicationId: number,
    status: ApplicationStatus,
    notes?: string,
  ): Promise<JobApplication> {
    const application = await this.jobApplicationRepository.findOne({
      where: { id: applicationId },
      relations: ['job', 'journalist'],
    });

    if (!application) {
      throw new NotFoundException(`Application with ID ${applicationId} not found`);
    }

    application.status = status;

    if (status === ApplicationStatus.REJECTED) {
      application.rejectionReason = notes;
      application.rejectedAt = new Date();
    } else if (status === ApplicationStatus.ACCEPTED) {
      application.acceptanceNotes = notes;
      application.acceptedAt = new Date();
    }

    return this.jobApplicationRepository.save(application);
  }

  async searchJobs(filters: any): Promise<Job[]> {
    const {
      location,
      mediaWorkType,
      jobType,
      experienceLevel,
      salaryMin,
      salaryMax,
      limit = 20,
      offset = 0,
    } = filters;

    const queryBuilder = this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company')
      .where('job.status = :status', { status: JobStatus.PUBLISHED });

    if (location) {
      queryBuilder.andWhere(
        'JSON_CONTAINS(job.locations, :location)',
        { location: JSON.stringify({ city: location }) }
      );
    }

    if (mediaWorkType) {
      queryBuilder.andWhere('job.mediaWorkType = :mediaWorkType', { mediaWorkType });
    }

    if (jobType) {
      queryBuilder.andWhere('job.jobType = :jobType', { jobType });
    }

    if (experienceLevel) {
      queryBuilder.andWhere('job.experienceLevel = :experienceLevel', { experienceLevel });
    }

    if (salaryMin || salaryMax) {
      if (salaryMin && salaryMax) {
        queryBuilder.andWhere('job.salary->>"$.min" >= :salaryMin AND job.salary->>"$.max" <= :salaryMax', {
          salaryMin,
          salaryMax,
        });
      } else if (salaryMin) {
        queryBuilder.andWhere('job.salary->>"$.min" >= :salaryMin', { salaryMin });
      } else if (salaryMax) {
        queryBuilder.andWhere('job.salary->>"$.max" <= :salaryMax', { salaryMax });
      }
    }

    queryBuilder
      .orderBy('job.isUrgent', 'DESC')
      .addOrderBy('job.createdAt', 'DESC')
      .limit(limit)
      .offset(offset);

    return queryBuilder.getMany();
  }

  async incrementViews(id: number): Promise<void> {
    await this.jobRepository.increment({ id }, 'viewsCount', 1);
  }

  async getUrgentJobs(): Promise<Job[]> {
    return this.jobRepository.find({
      relations: ['company'],
      where: { isUrgent: true, status: JobStatus.PUBLISHED },
      order: { createdAt: 'DESC' },
      take: 10,
    });
  }

  async getFeaturedJobs(): Promise<Job[]> {
    return this.jobRepository.find({
      relations: ['company'],
      where: { isFeatured: true, status: JobStatus.PUBLISHED },
      order: { createdAt: 'DESC' },
      take: 10,
    });
  }
}
