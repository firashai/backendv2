import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { User } from '../users/entities/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { JobApplication } from '../jobs/entities/job-application.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(JobApplication)
    private readonly jobApplicationRepository: Repository<JobApplication>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const company = this.companyRepository.create(createCompanyDto);
    return this.companyRepository.save(company);
  }

  async findAll(): Promise<Company[]> {
    return this.companyRepository.find({
      relations: ['user', 'jobs'],
    });
  }

  async findOne(id: number): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: ['user', 'jobs'],
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return company;
  }

  async findByUserId(userId: number): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'jobs'],
    });

    if (!company) {
      throw new NotFoundException(`Company with user ID ${userId} not found`);
    }

    return company;
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto, user: User): Promise<Company> {
    const company = await this.findOne(id);
    
    // Check if user owns this company
    if (company.user.id !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You can only update your own company');
    }
    
    Object.assign(company, updateCompanyDto);
    return this.companyRepository.save(company);
  }

  async remove(id: number, user: User): Promise<void> {
    const company = await this.findOne(id);
    
    // Check if user owns this company
    if (company.user.id !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You can only delete your own company');
    }
    
    await this.companyRepository.remove(company);
  }

  async getVerifiedCompanies(): Promise<Company[]> {
    return this.companyRepository.find({
      relations: ['user'],
      where: { isVerified: true, isActive: true },
      order: { rating: 'DESC' },
    });
  }

  async updateRating(id: number, newRating: number): Promise<Company> {
    const company = await this.findOne(id);
    
    const totalRating = company.rating * company.totalReviews + newRating;
    company.totalReviews += 1;
    company.rating = totalRating / company.totalReviews;

    return this.companyRepository.save(company);
  }

  // User-specific management methods
  async getMyProfile(userId: number): Promise<Company> {
    return this.findByUserId(userId);
  }

  async updateMyProfile(userId: number, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    const company = await this.findByUserId(userId);
    Object.assign(company, updateCompanyDto);
    return this.companyRepository.save(company);
  }

  async getMyJobs(userId: number): Promise<Job[]> {
    const company = await this.findByUserId(userId);
    return this.jobRepository.find({
      where: { company: { id: company.id } },
      relations: ['company', 'applications'],
      order: { createdAt: 'DESC' },
    });
  }

  async getMyApplications(userId: number): Promise<JobApplication[]> {
    const company = await this.findByUserId(userId);
    return this.jobApplicationRepository.find({
      where: { company: { id: company.id } },
      relations: [
        'job',
        'journalist',
        'journalist.user',
        'company'
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async getMyApplication(applicationId: number, userId: number): Promise<JobApplication> {
    const company = await this.findByUserId(userId);
    const application = await this.jobApplicationRepository.findOne({
      where: { 
        id: applicationId,
        company: { id: company.id } 
      },
      relations: [
        'job',
        'journalist',
        'journalist.user',
        'company'
      ],
    });

    if (!application) {
      throw new NotFoundException(`Job application with ID ${applicationId} not found for your company`);
    }

    return application;
  }
}
