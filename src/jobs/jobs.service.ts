import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Job } from './entities/job.entity';
import { JobApplication } from './entities/job-application.entity';
import { JobRequiredSkill } from './entities/job-required-skill.entity';
import { JobRequiredLanguage } from './entities/job-required-language.entity';
import { JobMediaWorkType } from './entities/job-media-work-type.entity';
import { JobLocation } from './entities/job-location.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ApplyForJobDto } from './dto/apply-for-job.dto';
import { SearchJobDto } from './dto/search-job.dto';
import { JobStatus, JobType } from './entities/job.entity';
import { ApplicationStatus } from './entities/job-application.entity';
import { User } from '../users/entities/user.entity';
import { Journalist } from '../journalists/entities/journalist.entity';
import { Skill } from '../skills/entities/skill.entity';
import { Language } from '../languages/entities/language.entity';
import { MediaWorkType } from '../media-work-types/entities/media-work-type.entity';
import { Country } from '../countries/entities/country.entity';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(JobApplication)
    private readonly jobApplicationRepository: Repository<JobApplication>,
    @InjectRepository(Journalist)
    private readonly journalistRepository: Repository<Journalist>,
    @InjectRepository(JobRequiredSkill)
    private readonly jobRequiredSkillRepository: Repository<JobRequiredSkill>,
    @InjectRepository(JobRequiredLanguage)
    private readonly jobRequiredLanguageRepository: Repository<JobRequiredLanguage>,
    @InjectRepository(JobMediaWorkType)
    private readonly jobMediaWorkTypeRepository: Repository<JobMediaWorkType>,
    @InjectRepository(JobLocation)
    private readonly jobLocationRepository: Repository<JobLocation>,
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
    @InjectRepository(MediaWorkType)
    private readonly mediaWorkTypeRepository: Repository<MediaWorkType>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async create(createJobDto: CreateJobDto, user: User): Promise<Job> {
    // Prepare the job data with proper salary structure
    const jobData: any = {
      ...createJobDto,
      company: user.company, // Associate with the company
      postedBy: user, // Associate with the user who posted the job
    };

    // Handle salary object structure
    if (createJobDto.salaryMin || createJobDto.salaryMax) {
      jobData.salary = {
        min: createJobDto.salaryMin || 0,
        max: createJobDto.salaryMax || 0,
        currency: createJobDto.salaryCurrency || 'USD',
        period: createJobDto.salaryPeriod || 'monthly',
        isNegotiable: false
      };
    }

    // Handle contact info object structure
    if (createJobDto.contactEmail || createJobDto.contactPhone || createJobDto.contactInfo) {
      jobData.contactInfo = {
        name: createJobDto.contactInfo?.name || '',
        email: createJobDto.contactEmail || createJobDto.contactInfo?.email || '',
        phone: createJobDto.contactPhone || createJobDto.contactInfo?.phone || '',
        preferredContact: createJobDto.contactInfo?.preferredContact || 'email'
      };
    }

    // Handle date fields - convert strings to Date objects
    if (createJobDto.applicationDeadline) {
      jobData.applicationDeadline = new Date(createJobDto.applicationDeadline);
    }
    if (createJobDto.startDate) {
      jobData.startDate = new Date(createJobDto.startDate);
    }
    if (createJobDto.endDate) {
      jobData.endDate = new Date(createJobDto.endDate);
    }

    // Remove the individual salary fields as they're now in the salary object
    delete jobData.salaryMin;
    delete jobData.salaryMax;
    delete jobData.salaryCurrency;
    delete jobData.salaryPeriod;

    // Remove individual contact fields as they're now in the contactInfo object
    delete jobData.contactEmail;
    delete jobData.contactPhone;

    // Create the main job entity
    const job = this.jobRepository.create(jobData);
    
    const savedJob = await this.jobRepository.save(job);
    
    // Handle junction table relationships if they exist in the DTO
    const jobId = Array.isArray(savedJob) ? (savedJob as Job[])[0].id : (savedJob as Job).id;
    
    // Handle required skills
    if (createJobDto.requiredSkills && createJobDto.requiredSkills.length > 0) {
      await this.handleJobRequiredSkills(jobId, createJobDto.requiredSkills);
    }
    
    // Handle required languages
    if (createJobDto.requiredLanguages && createJobDto.requiredLanguages.length > 0) {
      await this.handleJobRequiredLanguages(jobId, createJobDto.requiredLanguages);
    }
    
    // Handle media work types
    if (createJobDto.mediaWorkTypes && createJobDto.mediaWorkTypes.length > 0) {
      await this.handleJobMediaWorkTypes(jobId, createJobDto.mediaWorkTypes);
    }
    
    // Handle locations
    if (createJobDto.locations && createJobDto.locations.length > 0) {
      await this.handleJobLocations(jobId, createJobDto.locations);
    }
    
    // Return the job with all relations
    return this.findOne(jobId);
  }

  async findAll(searchDto?: SearchJobDto): Promise<Job[]> {
    // STEP 1: Build a lightweight query to select unique job IDs with filters applied
    const idsQuery = this.jobRepository.createQueryBuilder('job')
      .select('job.id', 'id')
      .distinct(true)
      .leftJoin('job.jobMediaWorkTypes', 'jobMediaWorkType')
      .leftJoin('job.jobRequiredSkills', 'jobRequiredSkill')
      .leftJoin('job.jobRequiredLanguages', 'jobRequiredLanguage')
      .leftJoin('job.jobLocations', 'jobLocation')
      .where('job.status = :status', { status: JobStatus.PUBLISHED });

    if (searchDto?.location) {
      idsQuery.leftJoin('jobLocation.country', 'country')
        .andWhere('(country.name LIKE :location OR jobLocation.city LIKE :location)', { location: `%${searchDto.location}%` });
    }

    if ((searchDto as any)?.mediaWorkTypes?.length) {
      idsQuery.leftJoin('jobMediaWorkType.mediaWorkType', 'mediaWorkType')
        .andWhere('mediaWorkType.name IN (:...mediaWorkTypes)', { mediaWorkTypes: (searchDto as any).mediaWorkTypes });
    } else if (searchDto?.mediaWorkType) {
      idsQuery.leftJoin('jobMediaWorkType.mediaWorkType', 'mediaWorkType')
        .andWhere('mediaWorkType.name = :mediaWorkType', { mediaWorkType: searchDto.mediaWorkType });
    }

    if (searchDto?.jobType) {
      idsQuery.andWhere('job.jobType = :jobType', { jobType: searchDto.jobType });
    }

    if (searchDto?.analystSpecialty) {
      if (!searchDto?.mediaWorkType) {
        idsQuery.leftJoin('jobMediaWorkType.mediaWorkType', 'mediaWorkType');
      }
      idsQuery.andWhere('mediaWorkType.name = :analystSpecialty', { analystSpecialty: searchDto.analystSpecialty });
    }

    if (searchDto?.skills && searchDto.skills.length > 0) {
      idsQuery.leftJoin('jobRequiredSkill.skill', 'skill')
        .andWhere('skill.name IN (:...skills)', { skills: searchDto.skills });
    }

    if (searchDto?.languages && searchDto.languages.length > 0) {
      idsQuery.leftJoin('jobRequiredLanguage.language', 'language')
        .andWhere('language.name IN (:...languages)', { languages: searchDto.languages });
    }

    if ((searchDto as any)?.locations?.length) {
      idsQuery.leftJoin('jobLocation.country', 'country_multi')
        .andWhere('country_multi.name IN (:...locs)', { locs: (searchDto as any).locations });
    }

    if ((searchDto as any)?.jobTypes?.length) {
      idsQuery.andWhere('job.jobType IN (:...jobTypes)', { jobTypes: (searchDto as any).jobTypes });
    }

    idsQuery.orderBy('job.createdAt', 'DESC');

    if (searchDto?.limit) {
      idsQuery.limit(searchDto.limit);
    }

    if (searchDto?.offset) {
      idsQuery.offset(searchDto.offset);
    }

    const rawIds = await idsQuery.getRawMany<{ id: number }>();
    const jobIds = rawIds.map(r => r.id);

    if (jobIds.length === 0) {
      return [];
    }

    // STEP 2: Load full entities for the selected IDs with relations
    const fullQuery = this.jobRepository.createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company')
      .leftJoinAndSelect('job.jobMediaWorkTypes', 'jobMediaWorkType')
      .leftJoinAndSelect('job.jobRequiredSkills', 'jobRequiredSkill')
      .leftJoinAndSelect('job.jobRequiredLanguages', 'jobRequiredLanguage')
      .leftJoinAndSelect('job.jobLocations', 'jobLocation')
      .where('job.id IN (:...ids)', { ids: jobIds })
      .orderBy('job.createdAt', 'DESC');

    return fullQuery.getMany();
  }

  async findOne(id: number): Promise<Job> {
    const job = await this.jobRepository.findOne({
      where: { id },
      relations: [
        'company', 
        'postedBy',
        'jobRequiredSkills',
        'jobRequiredSkills.skill',
        'jobMediaWorkTypes',
        'jobMediaWorkTypes.mediaWorkType',
        'jobRequiredLanguages',
        'jobRequiredLanguages.language',
        'jobLocations',
        'jobLocations.country'
      ],
    });

    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    // Calculate applications count and average bid from actual applications
    if (job.applications && job.applications.length > 0) {
      job.applicationsCount = job.applications.length;
      
      // Calculate average proposed rate from applications that have a proposed rate
      const applicationsWithRates = job.applications.filter(app => app.proposedRate && app.proposedRate > 0);
      if (applicationsWithRates.length > 0) {
        const totalRates = applicationsWithRates.reduce((sum, app) => sum + Number(app.proposedRate), 0);
        job.averageBid = Math.round(totalRates / applicationsWithRates.length);
      } else {
        job.averageBid = 0;
      }
    } else {
      job.applicationsCount = 0;
      job.averageBid = 0;
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

  async findByUser(userId: number): Promise<Job[]> {
    return this.jobRepository.find({
      where: { postedByUserId: userId },
      relations: ['company', 'postedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findApplicationsByUser(userId: number): Promise<any[]> {
    // Since we don't have relations, we'll need to join with journalists table and jobs table
    return this.jobApplicationRepository
      .createQueryBuilder('application')
      .leftJoin('journalists', 'journalist', 'application.journalistId = journalist.id')
      .leftJoin('jobs', 'job', 'application.jobId = job.id')
      .leftJoin('companies', 'company', 'job.companyId = company.id')
      .leftJoin('countries', 'country', 'company.countryId = country.id')
      .select([
        'application.id',
        'application.jobId',
        'application.coverLetter',
        'application.proposedRate',
        'application.proposedRateCurrency',
        'application.status',
        'application.createdAt',
        'job.id',
        'job.title',
        'job.jobType',
        'company.id',
        'company.name',
        'country.id',
        'country.name'
      ])
      .where('journalist.userId = :userId', { userId })
      .orderBy('application.createdAt', 'DESC')
      .getRawMany();
  }

  async findSimilarJobs(jobId: number): Promise<Job[]> {
    // First, get the current job with its relations
    const currentJob = await this.jobRepository.findOne({
      where: { id: jobId },
      relations: [
        'jobRequiredSkills',
        'jobRequiredSkills.skill',
        'jobMediaWorkTypes',
        'jobMediaWorkTypes.mediaWorkType',
        'jobRequiredLanguages',
        'jobRequiredLanguages.language',
        'jobLocations',
        'jobLocations.country'
      ],
    });

    if (!currentJob) {
      return [];
    }

    // Extract similar criteria from the current job
    const currentSkills = currentJob.jobRequiredSkills?.map(js => js.skill.name) || [];
    const currentMediaWorkTypes = currentJob.jobMediaWorkTypes?.map(mwt => mwt.mediaWorkType.name) || [];
    const currentLanguages = currentJob.jobRequiredLanguages?.map(rl => rl.language.name) || [];
    const currentLocations = currentJob.jobLocations?.map(jl => jl.country.name) || [];
    const currentExperienceLevel = currentJob.experienceLevel;
    const currentJobType = currentJob.jobType;

    // Build query to find similar jobs
    const query = this.jobRepository.createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company')
      .leftJoinAndSelect('job.postedBy', 'postedBy')
      .leftJoinAndSelect('job.jobRequiredSkills', 'jobRequiredSkill')
      .leftJoinAndSelect('jobRequiredSkill.skill', 'skill')
      .leftJoinAndSelect('job.jobMediaWorkTypes', 'jobMediaWorkType')
      .leftJoinAndSelect('jobMediaWorkType.mediaWorkType', 'mediaWorkType')
      .leftJoinAndSelect('job.jobRequiredLanguages', 'jobRequiredLanguage')
      .leftJoinAndSelect('jobRequiredLanguage.language', 'language')
      .leftJoinAndSelect('job.jobLocations', 'jobLocation')
      .leftJoinAndSelect('jobLocation.country', 'country')
      .where('job.id != :currentJobId', { currentJobId: jobId })
      .andWhere('job.status = :status', { status: 'published' });

    // Add similarity conditions
    const similarityConditions = [];

    // Similar skills
    if (currentSkills.length > 0) {
      similarityConditions.push(
        `EXISTS (
          SELECT 1 FROM job_required_skills jrs 
          JOIN skills s ON jrs.skillId = s.id 
          WHERE jrs.jobId = job.id 
          AND s.name IN (:...currentSkills)
        )`
      );
    }

    // Similar media work types
    if (currentMediaWorkTypes.length > 0) {
      similarityConditions.push(
        `EXISTS (
          SELECT 1 FROM job_media_work_types jmwt 
          JOIN media_work_types mwt ON jmwt.mediaWorkTypeId = mwt.id 
          WHERE jmwt.jobId = job.id 
          AND mwt.name IN (:...currentMediaWorkTypes)
        )`
      );
    }

    // Similar experience level
    if (currentExperienceLevel) {
      similarityConditions.push('job.experienceLevel = :currentExperienceLevel');
    }

    // Similar job type
    if (currentJobType) {
      similarityConditions.push('job.jobType = :currentJobType');
    }

    // Apply similarity conditions
    if (similarityConditions.length > 0) {
      query.andWhere(`(${similarityConditions.join(' OR ')})`);
    }

    // Set parameters
    if (currentSkills.length > 0) {
      query.setParameter('currentSkills', currentSkills);
    }
    if (currentMediaWorkTypes.length > 0) {
      query.setParameter('currentMediaWorkTypes', currentMediaWorkTypes);
    }
    if (currentExperienceLevel) {
      query.setParameter('currentExperienceLevel', currentExperienceLevel);
    }
    if (currentJobType) {
      query.setParameter('currentJobType', currentJobType);
    }

    // Order by similarity (most recent first as a fallback)
    query.orderBy('job.createdAt', 'DESC');

    // Limit to 5 similar jobs
    query.limit(5);

    return query.getMany();
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
    const { 
      coverLetter, 
      resumeUrl, 
      resumeFilename, 
      resumeSize, 
      portfolio, 
      samples, 
      proposedRate, 
      proposedRateCurrency,
      proposedRatePeriod,
      availableStartDate, 
      availability, 
      answers, 
      references, 
      equipment, 
      experience, 
      education, 
      notes,
      additionalInfo,
      skills,
      mediaWorkTypeId
    } = applyDto;

    const job = await this.findOne(jobId);
    
    console.log('Job data:', {
      id: job.id,
      title: job.title,
      company: job.company,
      companyId: job.company?.id
    });
    
    console.log('Job ID type and value:', {
      jobId: job.id,
      jobIdType: typeof job.id,
      jobIdString: String(job.id)
    });
    
    if (job.status !== JobStatus.PUBLISHED) {
      throw new BadRequestException('Job is not available for applications');
    }

    // Resolve journalist by current user
    const journalist = await this.journalistRepository.findOne({
      where: { user: { id: user.id } },
    });
    
    console.log('Journalist data:', {
      id: journalist.id,
      userId: journalist.user?.id
    });

    if (!journalist) {
      throw new BadRequestException('Only journalists can apply for jobs');
    }

    // Check if already applied
    const existingApplication = await this.jobApplicationRepository.findOne({
      where: { jobId: jobId, journalistId: journalist.id },
    });

    if (existingApplication) {
      throw new BadRequestException('You have already applied for this job');
    }

    console.log('Creating application with:', {
      jobId: job.id,
      journalistId: journalist.id,
      companyId: job.company?.id || null
    });
    
    // Create application with explicit foreign key values
    const applicationData = {
      jobId: job.id,
      journalistId: journalist.id,
      companyId: job.company?.id || null,
      coverLetter,
      resumeUrl,
      resumeFilename,
      resumeSize,
      portfolio,
      samples,
      proposedRate,
      proposedRateCurrency,
      proposedRatePeriod,
      availableStartDate: availableStartDate ? new Date(availableStartDate) : undefined,
      availability,
      answers,
      references,
      equipment,
      experience,
      education,
      notes,
      additionalInfo,
      skills,
      mediaWorkTypeId,
      status: ApplicationStatus.PENDING,
    };

    // Try using insert method instead of create/save
    console.log('Inserting application data:', applicationData);
    const insertResult = await this.jobApplicationRepository.insert(applicationData);
    console.log('Insert result:', insertResult);
    
    const savedApplication = await this.jobApplicationRepository.findOne({
      where: { id: insertResult.identifiers[0].id }
    });
    
    console.log('Saved application:', {
      id: savedApplication.id,
      jobId: savedApplication.jobId,
      journalistId: savedApplication.journalistId,
      companyId: savedApplication.companyId
    });
    
    // Verify the saved application by querying it back
    const verifyApplication = await this.jobApplicationRepository.findOne({
      where: { id: savedApplication.id }
    });
    
    console.log('Verified application from database:', {
      id: verifyApplication?.id,
      jobId: verifyApplication?.jobId,
      journalistId: verifyApplication?.journalistId,
      companyId: verifyApplication?.companyId
    });

    // Update job applications count
    job.applicationsCount += 1;
    await this.jobRepository.save(job);

    return savedApplication;
  }

  async getApplicationsByJob(jobId: number): Promise<JobApplication[]> {
    return this.jobApplicationRepository.find({
      where: { jobId: jobId },
      order: { createdAt: 'DESC' },
    });
  }

  async getApplicationsByJournalist(journalistId: number): Promise<JobApplication[]> {
    return this.jobApplicationRepository.find({
      where: { journalistId: journalistId },
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

  // Helper methods for handling junction table relationships
  private async handleJobRequiredSkills(jobId: number, skillNames: string[]): Promise<void> {
    for (const skillName of skillNames) {
      // Find or create the skill
      let skill = await this.skillRepository.findOne({ where: { name: skillName } });
      if (!skill) {
        skill = this.skillRepository.create({ name: skillName });
        skill = await this.skillRepository.save(skill);
      }
      
      // Create the junction table entry
      const jobRequiredSkill = this.jobRequiredSkillRepository.create({
        job: { id: jobId },
        skill: skill
      });
      await this.jobRequiredSkillRepository.save(jobRequiredSkill);
    }
  }

  private async handleJobRequiredLanguages(jobId: number, languageNames: string[]): Promise<void> {
    for (const languageName of languageNames) {
      // Find or create the language
      let language = await this.languageRepository.findOne({ where: { name: languageName } });
      if (!language) {
        // Generate a simple code from the name (first 5 characters, uppercase)
        const code = languageName.substring(0, 5).toUpperCase();
        language = this.languageRepository.create({ 
          name: languageName,
          code: code
        });
        language = await this.languageRepository.save(language);
      }
      
      // Create the junction table entry
      const jobRequiredLanguage = this.jobRequiredLanguageRepository.create({
        job: { id: jobId },
        language: language
      });
      await this.jobRequiredLanguageRepository.save(jobRequiredLanguage);
    }
  }

  private async handleJobMediaWorkTypes(jobId: number, mediaWorkTypeNames: string[]): Promise<void> {
    for (const mediaWorkTypeName of mediaWorkTypeNames) {
      // Find or create the media work type
      let mediaWorkType = await this.mediaWorkTypeRepository.findOne({ where: { name: mediaWorkTypeName } });
      if (!mediaWorkType) {
        mediaWorkType = this.mediaWorkTypeRepository.create({ name: mediaWorkTypeName });
        mediaWorkType = await this.mediaWorkTypeRepository.save(mediaWorkType);
      }
      
      // Create the junction table entry
      const jobMediaWorkType = this.jobMediaWorkTypeRepository.create({
        job: { id: jobId },
        mediaWorkType: mediaWorkType
      });
      await this.jobMediaWorkTypeRepository.save(jobMediaWorkType);
    }
  }

  private async handleJobLocations(jobId: number, locationNames: string[]): Promise<void> {
    for (const locationName of locationNames) {
      // Find or create the country
      let country = await this.countryRepository.findOne({ where: { name: locationName } });
      if (!country) {
        // Generate a simple code from the name (first 3 characters, uppercase)
        const code = locationName.substring(0, 3).toUpperCase();
        country = this.countryRepository.create({ 
          name: locationName,
          code: code
        });
        country = await this.countryRepository.save(country);
      }
      
      // Create the junction table entry
      const jobLocation = this.jobLocationRepository.create({
        job: { id: jobId },
        country: country
      });
      await this.jobLocationRepository.save(jobLocation);
    }
  }
}
