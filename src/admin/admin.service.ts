import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User, UserRole, UserStatus } from '../users/entities/user.entity';
import { Journalist, ExperienceLevel } from '../journalists/entities/journalist.entity';
import { Company } from '../companies/entities/company.entity';
import { Job, JobStatus } from '../jobs/entities/job.entity';
import { MediaContent, MediaStatus } from '../media-content/entities/media-content.entity';
import { JobApplication, ApplicationStatus } from '../jobs/entities/job-application.entity';
import { MediaPurchase } from '../media-content/entities/media-purchase.entity';
import { Skill } from '../skills/entities/skill.entity';
import { Country } from '../countries/entities/country.entity';
import { Language } from '../languages/entities/language.entity';
import { AnalystSpecialty } from '../analyst-specialty/entities/analyst-specialty.entity';
import { MediaWorkType } from '../media-work-types/entities/media-work-type.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Journalist)
    private journalistRepository: Repository<Journalist>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectRepository(MediaContent)
    private mediaContentRepository: Repository<MediaContent>,
    @InjectRepository(JobApplication)
    private jobApplicationRepository: Repository<JobApplication>,
    @InjectRepository(MediaPurchase)
    private mediaPurchaseRepository: Repository<MediaPurchase>,
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
    @InjectRepository(AnalystSpecialty)
    private analystSpecialtyRepository: Repository<AnalystSpecialty>,
    @InjectRepository(MediaWorkType)
    private mediaWorkTypeRepository: Repository<MediaWorkType>,
  ) {}

  // Dashboard Statistics
  async getDashboardStats() {
    const [
      totalUsers,
      pendingUsers,
      totalJournalists,
      pendingJournalists,
      totalCompanies,
      pendingCompanies,
      totalJobs,
      pendingJobs,
      totalMedia,
      pendingMedia,
      totalApplications,
      totalPurchases,
    ] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { status: UserStatus.PENDING } }),
      this.journalistRepository.count(),
      this.journalistRepository.count({ where: { isApproved: false } }),
      this.companyRepository.count(),
      this.companyRepository.count({ where: { isVerified: false } }),
      this.jobRepository.count(),
      this.jobRepository.count({ where: { isApproved: false } }),
      this.mediaContentRepository.count(),
      this.mediaContentRepository.count({ where: { isApproved: false } }),
      this.jobApplicationRepository.count(),
      this.mediaPurchaseRepository.count(),
    ]);

    return {
      users: { total: totalUsers, pending: pendingUsers },
      journalists: { total: totalJournalists, pending: pendingJournalists },
      companies: { total: totalCompanies, pending: pendingCompanies },
      jobs: { total: totalJobs, pending: pendingJobs },
      media: { total: totalMedia, pending: pendingMedia },
      applications: { total: totalApplications },
      purchases: { total: totalPurchases },
    };
  }

  // User Management
  async getAllUsers(page = 1, limit = 10, status?: UserStatus, role?: UserRole) {
    // Ensure page and limit are numbers
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    
    const query = this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.journalist', 'journalist')
      .leftJoinAndSelect('user.company', 'company');

    if (status) {
      query.andWhere('user.status = :status', { status });
    }
    if (role) {
      query.andWhere('user.role = :role', { role });
    }

    const [users, total] = await query
      .skip((pageNum - 1) * limitNum)
      .take(limitNum)
      .orderBy('user.createdAt', 'DESC')
      .getManyAndCount();

    return {
      users,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    };
  }

  async updateUserStatus(userId: number, status: UserStatus, adminId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.status = status;
    user.updatedAt = new Date();
    return await this.userRepository.save(user);
  }

  // Journalist Management
  async getAllJournalists(page = 1, limit = 10, approved?: boolean) {
    const query = this.journalistRepository.createQueryBuilder('journalist')
      .leftJoinAndSelect('journalist.user', 'user');

    if (approved !== undefined) {
      query.andWhere('journalist.isApproved = :approved', { approved });
    }

    const [journalists, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('journalist.createdAt', 'DESC')
      .getManyAndCount();

    return {
      journalists,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async approveJournalist(journalistId: number, approved: boolean, adminId: number, notes?: string) {
    const journalist = await this.journalistRepository.findOne({ 
      where: { id: journalistId },
      relations: ['user']
    });
    
    if (!journalist) {
      throw new NotFoundException('Journalist not found');
    }

    journalist.isApproved = approved;
    journalist.approvedBy = adminId;
    journalist.approvedAt = new Date();
    journalist.approvalNotes = notes;

    // Update user status if journalist is approved
    if (approved && journalist.user) {
      journalist.user.status = UserStatus.ACTIVE;
      await this.userRepository.save(journalist.user);
    }

    return await this.journalistRepository.save(journalist);
  }

  async updateJournalist(journalistId: number, updateData: any, adminId: number) {
    const journalist = await this.journalistRepository.findOne({ 
      where: { id: journalistId },
      relations: ['user']
    });
    
    if (!journalist) {
      throw new NotFoundException('Journalist not found');
    }

    // Update journalist fields
    // Note: mediaWorkType, analystSpecialty now handled by junction tables
    if (updateData.experienceLevel !== undefined) {
      journalist.experienceLevel = updateData.experienceLevel;
    }
    if (updateData.hasCamera !== undefined) {
      journalist.hasCamera = updateData.hasCamera;
    }
    if (updateData.cameraType !== undefined) {
      journalist.cameraType = updateData.cameraType;
    }
    if (updateData.hasAudioEquipment !== undefined) {
      journalist.hasAudioEquipment = updateData.hasAudioEquipment;
    }
    if (updateData.audioEquipmentType !== undefined) {
      journalist.audioEquipmentType = updateData.audioEquipmentType;
    }
    if (updateData.canTravel !== undefined) {
      journalist.canTravel = updateData.canTravel;
    }
    if (updateData.isAvailable !== undefined) {
      journalist.isAvailable = updateData.isAvailable;
    }
    if (updateData.hourlyRate !== undefined) {
      journalist.hourlyRate = updateData.hourlyRate;
    }
    if (updateData.dailyRate !== undefined) {
      journalist.dailyRate = updateData.dailyRate;
    }
    if (updateData.projectRate !== undefined) {
      journalist.projectRate = updateData.projectRate;
    }
    if (updateData.rating !== undefined) {
      journalist.rating = updateData.rating;
    }
    if (updateData.totalReviews !== undefined) {
      journalist.totalReviews = updateData.totalReviews;
    }
    if (updateData.completedProjects !== undefined) {
      journalist.completedProjects = updateData.completedProjects;
    }
    // Note: skills, languages now handled by junction tables
    if (updateData.certifications !== undefined) {
      journalist.certifications = updateData.certifications;
    }
    if (updateData.previousWorkLinks !== undefined) {
      journalist.previousWorkLinks = updateData.previousWorkLinks;
    }
    if (updateData.bio !== undefined) {
      journalist.bio = updateData.bio;
    }

    // Update user fields if provided
    if (updateData.user && journalist.user) {
      if (updateData.user.firstName !== undefined) {
        journalist.user.firstName = updateData.user.firstName;
      }
      if (updateData.user.lastName !== undefined) {
        journalist.user.lastName = updateData.user.lastName;
      }
      if (updateData.user.email !== undefined) {
        journalist.user.email = updateData.user.email;
      }
      if (updateData.user.phone !== undefined) {
        journalist.user.phone = updateData.user.phone;
      }
      if (updateData.user.city !== undefined) {
        journalist.user.city = updateData.user.city;
      }
      if (updateData.user.country !== undefined) {
        journalist.user.country = updateData.user.country;
      }

          // Save user changes
    await this.userRepository.save(journalist.user);
  }

  return await this.journalistRepository.save(journalist);
}

async updateCompany(companyId: number, updateData: any, adminId: number) {
  const company = await this.companyRepository.findOne({ 
    where: { id: companyId },
    relations: ['user']
  });
  
  if (!company) {
    throw new NotFoundException('Company not found');
  }

  // Update company fields
  if (updateData.name !== undefined) {
    company.name = updateData.name;
  }
  if (updateData.description !== undefined) {
    company.description = updateData.description;
  }
  if (updateData.industry !== undefined) {
    company.industry = updateData.industry;
  }
  if (updateData.website !== undefined) {
    company.website = updateData.website;
  }
  if (updateData.mission !== undefined) {
    company.mission = updateData.mission;
  }
  if (updateData.vision !== undefined) {
    company.vision = updateData.vision;
  }
  if (updateData.logo !== undefined) {
    company.logo = updateData.logo;
  }
  if (updateData.companySize !== undefined) {
    company.companySize = updateData.companySize;
  }
  if (updateData.specializations !== undefined) {
    company.specializations = updateData.specializations;
  }
  // Note: languages, locations now handled by junction tables
  if (updateData.socialMediaAccounts !== undefined) {
    company.socialMediaAccounts = updateData.socialMediaAccounts;
  }
  if (updateData.isVerified !== undefined) {
    company.isVerified = updateData.isVerified;
  }
  if (updateData.rating !== undefined) {
    company.rating = updateData.rating;
  }
  if (updateData.totalReviews !== undefined) {
    company.totalReviews = updateData.totalReviews;
  }
  if (updateData.completedProjects !== undefined) {
    company.completedProjects = updateData.completedProjects;
  }
  if (updateData.isActive !== undefined) {
    company.isActive = updateData.isActive;
  }
  if (updateData.contactPersons !== undefined) {
    company.contactPersons = updateData.contactPersons;
  }
  if (updateData.paymentMethods !== undefined) {
    company.paymentMethods = updateData.paymentMethods;
  }
  if (updateData.preferredCommunication !== undefined) {
    company.preferredCommunication = updateData.preferredCommunication;
  }

  // Update user fields if provided
  if (updateData.user && company.user) {
    if (updateData.user.firstName !== undefined) {
      company.user.firstName = updateData.user.firstName;
    }
    if (updateData.user.lastName !== undefined) {
      company.user.lastName = updateData.user.lastName;
    }
    if (updateData.user.email !== undefined) {
      company.user.email = updateData.user.email;
    }
    if (updateData.user.phone !== undefined) {
      company.user.phone = updateData.user.phone;
    }
    if (updateData.user.city !== undefined) {
      company.user.city = updateData.user.city;
    }
    if (updateData.user.country !== undefined) {
      company.user.country = updateData.user.country;
    }

    // Save user changes
    await this.userRepository.save(company.user);
  }

  return await this.companyRepository.save(company);
}

async updateJob(jobId: number, updateData: any, adminId: number) {
  const job = await this.jobRepository.findOne({ 
    where: { id: jobId },
    relations: ['company']
  });
  
  if (!job) {
    throw new NotFoundException('Job not found');
  }

  // Update job fields
  if (updateData.title !== undefined) {
    job.title = updateData.title;
  }
  if (updateData.description !== undefined) {
    job.description = updateData.description;
  }
  if (updateData.jobType !== undefined) {
    job.jobType = updateData.jobType;
  }
  if (updateData.status !== undefined) {
    job.status = updateData.status;
  }
  // Note: mediaWorkType, analystSpecialty, skills, languages, locations now handled by junction tables
  if (updateData.experienceLevel !== undefined) {
    job.experienceLevel = updateData.experienceLevel;
  }
  if (updateData.salary !== undefined) {
    job.salary = updateData.salary;
  }
  if (updateData.benefits !== undefined) {
    job.benefits = updateData.benefits;
  }
  if (updateData.requirements !== undefined) {
    job.requirements = updateData.requirements;
  }
  if (updateData.projectDetails !== undefined) {
    job.projectDetails = updateData.projectDetails;
  }
  if (updateData.startDate !== undefined) {
    job.startDate = updateData.startDate;
  }
  if (updateData.endDate !== undefined) {
    job.endDate = updateData.endDate;
  }
  if (updateData.applicationDeadline !== undefined) {
    job.applicationDeadline = updateData.applicationDeadline;
  }
  if (updateData.numberOfPositions !== undefined) {
    job.numberOfPositions = updateData.numberOfPositions;
  }
  if (updateData.tags !== undefined) {
    job.tags = updateData.tags;
  }
  if (updateData.categories !== undefined) {
    job.categories = updateData.categories;
  }
  if (updateData.additionalInfo !== undefined) {
    job.additionalInfo = updateData.additionalInfo;
  }
  if (updateData.contactInfo !== undefined) {
    job.contactInfo = updateData.contactInfo;
  }
  if (updateData.isUrgent !== undefined) {
    job.isUrgent = updateData.isUrgent;
  }
  if (updateData.isFeatured !== undefined) {
    job.isFeatured = updateData.isFeatured;
  }
  if (updateData.isVerified !== undefined) {
    job.isVerified = updateData.isVerified;
  }

  return await this.jobRepository.save(job);
}

async updateMediaContent(mediaId: number, updateData: any, adminId: number) {
  const media = await this.mediaContentRepository.findOne({ 
    where: { id: mediaId },
    relations: ['journalist']
  });
  
  if (!media) {
    throw new NotFoundException('Media content not found');
  }

  // Update media fields
  if (updateData.title !== undefined) {
    media.title = updateData.title;
  }
  if (updateData.description !== undefined) {
    media.description = updateData.description;
  }
  if (updateData.mediaType !== undefined) {
    media.mediaType = updateData.mediaType;
  }
  if (updateData.status !== undefined) {
    media.status = updateData.status;
  }
  if (updateData.fileUrl !== undefined) {
    media.fileUrl = updateData.fileUrl;
  }
  if (updateData.thumbnailUrl !== undefined) {
    media.thumbnailUrl = updateData.thumbnailUrl;
  }
  if (updateData.previewUrl !== undefined) {
    media.previewUrl = updateData.previewUrl;
  }
  if (updateData.price !== undefined) {
    media.price = updateData.price;
  }
  if (updateData.licenseType !== undefined) {
    media.licenseType = updateData.licenseType;
  }
  if (updateData.tags !== undefined) {
    media.tags = updateData.tags;
  }
  if (updateData.categories !== undefined) {
    media.categories = updateData.categories;
  }
  // Note: location now handled by junction tables
  if (updateData.recordedDate !== undefined) {
    media.recordedDate = updateData.recordedDate;
  }
  if (updateData.duration !== undefined) {
    media.duration = updateData.duration;
  }
  if (updateData.resolution !== undefined) {
    media.resolution = updateData.resolution;
  }
  if (updateData.fileSize !== undefined) {
    media.fileSize = updateData.fileSize;
  }
  if (updateData.metadata !== undefined) {
    media.metadata = updateData.metadata;
  }
  if (updateData.usageRights !== undefined) {
    media.usageRights = updateData.usageRights;
  }
  if (updateData.rating !== undefined) {
    media.rating = updateData.rating;
  }
  if (updateData.totalViews !== undefined) {
    media.totalViews = updateData.totalViews;
  }
  if (updateData.totalDownloads !== undefined) {
    media.totalDownloads = updateData.totalDownloads;
  }
  if (updateData.totalSales !== undefined) {
    media.totalSales = updateData.totalSales;
  }
  if (updateData.totalRevenue !== undefined) {
    media.totalRevenue = updateData.totalRevenue;
  }
  if (updateData.reviews !== undefined) {
    media.reviews = updateData.reviews;
  }
  if (updateData.isFeatured !== undefined) {
    media.isFeatured = updateData.isFeatured;
  }
  if (updateData.isVerified !== undefined) {
    media.isVerified = updateData.isVerified;
  }
  if (updateData.isApproved !== undefined) {
    media.isApproved = updateData.isApproved;
  }
  if (updateData.approvedBy !== undefined) {
    media.approvedBy = updateData.approvedBy;
  }
  if (updateData.approvedAt !== undefined) {
    media.approvedAt = updateData.approvedAt;
  }
  if (updateData.approvalNotes !== undefined) {
    media.approvalNotes = updateData.approvalNotes;
  }
  if (updateData.watermarks !== undefined) {
    media.watermarks = updateData.watermarks;
  }
  if (updateData.alternativeFormats !== undefined) {
    media.alternativeFormats = updateData.alternativeFormats;
  }

  return await this.mediaContentRepository.save(media);
}

  // Company Management
  async getAllCompanies(page = 1, limit = 10, verified?: boolean) {
    const query = this.companyRepository.createQueryBuilder('company')
      .leftJoinAndSelect('company.user', 'user');

    if (verified !== undefined) {
      query.andWhere('company.isVerified = :verified', { verified });
    }

    const [companies, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('company.createdAt', 'DESC')
      .getManyAndCount();

    return {
      companies,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async approveCompany(companyId: number, approved: boolean, adminId: number, notes?: string) {
    const company = await this.companyRepository.findOne({ 
      where: { id: companyId },
      relations: ['user']
    });
    
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    company.isVerified = approved;

    // Update user status if company is approved
    if (approved && company.user) {
      company.user.status = UserStatus.ACTIVE;
      await this.userRepository.save(company.user);
    }

    return await this.companyRepository.save(company);
  }

  // Job Management
  async getAllJobs(page = 1, limit = 10, approved?: boolean, status?: JobStatus) {
    try {
      // Ensure page and limit are numbers
      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 10;
      
      console.log('AdminService.getAllJobs called with:', { page: pageNum, limit: limitNum, approved, status });
      
      // First, let's check if there are any jobs at all
      const totalJobsCount = await this.jobRepository.count();
      console.log('Total jobs in database:', totalJobsCount);
      
      // Check companies
      const totalCompaniesCount = await this.companyRepository.count();
      console.log('Total companies in database:', totalCompaniesCount);
      
      const query = this.jobRepository.createQueryBuilder('job')
        .leftJoinAndSelect('job.company', 'company')
        .leftJoinAndSelect('company.user', 'user')
        .leftJoinAndSelect('job.postedBy', 'postedBy')
        .leftJoinAndSelect('job.jobRequiredSkills', 'jobRequiredSkills')
        .leftJoinAndSelect('jobRequiredSkills.skill', 'skill')
        .leftJoinAndSelect('job.jobRequiredLanguages', 'jobRequiredLanguages')
        .leftJoinAndSelect('jobRequiredLanguages.language', 'language')
        .leftJoinAndSelect('job.jobMediaWorkTypes', 'jobMediaWorkTypes')
        .leftJoinAndSelect('jobMediaWorkTypes.mediaWorkType', 'mediaWorkType')
        .leftJoinAndSelect('job.jobLocations', 'jobLocations')
        .leftJoinAndSelect('jobLocations.country', 'country');

      if (approved !== undefined) {
        query.andWhere('job.isApproved = :approved', { approved });
      }
      if (status) {
        query.andWhere('job.status = :status', { status });
      }

      const [jobs, total] = await query
        .skip((pageNum - 1) * limitNum)
        .take(limitNum)
        .orderBy('job.createdAt', 'DESC')
        .getManyAndCount();

      console.log('AdminService.getAllJobs result:', { jobsCount: jobs.length, total });
      
      // Debug job relations
      if (jobs.length > 0) {
        console.log('First job structure:', {
          id: jobs[0].id,
          title: jobs[0].title,
          hasCompany: !!jobs[0].company,
          company: jobs[0].company,
          hasPostedBy: !!jobs[0].postedBy,
          postedBy: jobs[0].postedBy
        });
      }

      return {
        jobs,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      };
    } catch (error) {
      console.error('Error in AdminService.getAllJobs:', error);
      throw error;
    }
  }

  async approveJob(jobId: number, approved: boolean, adminId: number, notes?: string) {
    const job = await this.jobRepository.findOne({ 
      where: { id: jobId },
      relations: ['company']
    });
    
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    job.isApproved = approved;
    job.approvedBy = adminId;
    job.approvedAt = new Date();
    job.approvalNotes = notes;

    // Update job status to published if approved
    if (approved) {
      job.status = JobStatus.PUBLISHED;
    }

    return await this.jobRepository.save(job);
  }

  // Media Content Management
  async getAllMediaContent(page = 1, limit = 10, approved?: boolean, status?: MediaStatus) {
    const query = this.mediaContentRepository.createQueryBuilder('media')
      .leftJoinAndSelect('media.journalist', 'journalist')
      .leftJoinAndSelect('journalist.user', 'user');

    if (approved !== undefined) {
      query.andWhere('media.isApproved = :approved', { approved });
    }
    if (status) {
      query.andWhere('media.status = :status', { status });
    }

    const [mediaContent, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('media.createdAt', 'DESC')
      .getManyAndCount();

    return {
      mediaContent,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async approveMediaContent(mediaId: number, approved: boolean, adminId: number, notes?: string) {
    const media = await this.mediaContentRepository.findOne({ 
      where: { id: mediaId },
      relations: ['journalist']
    });
    
    if (!media) {
      throw new NotFoundException('Media content not found');
    }

    media.isApproved = approved;
    media.approvedBy = adminId;
    media.approvedAt = new Date();
    media.approvalNotes = notes;

    // Update media status to published if approved
    if (approved) {
      media.status = MediaStatus.PUBLISHED;
    }

    return await this.mediaContentRepository.save(media);
  }

  // Application Management
  async getAllApplications(page = 1, limit = 10, status?: string, jobId?: number) {
    // Ensure page and limit are numbers
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    
    const query = this.jobApplicationRepository
      .createQueryBuilder('application')
      .leftJoinAndSelect('application.job', 'job')
      .leftJoinAndSelect('application.journalist', 'journalist')
      .leftJoinAndSelect('journalist.user', 'user')
      .leftJoinAndSelect('application.company', 'company');

    if (status) {
      query.andWhere('application.status = :status', { status });
    }
    if (jobId) {
      query.andWhere('application.job.id = :jobId', { jobId });
    }

    const [applications, total] = await query
      .skip((pageNum - 1) * limitNum)
      .take(limitNum)
      .orderBy('application.createdAt', 'DESC')
      .getManyAndCount();

    return {
      applications,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    };
  }

  async updateApplicationStatus(applicationId: number, status: string, adminId: number, notes?: string) {
    const application = await this.jobApplicationRepository.findOne({ 
      where: { id: applicationId },
      relations: ['job', 'journalist']
    });
    
    if (!application) {
      throw new NotFoundException('Application not found');
    }

    application.status = status as ApplicationStatus;
    
    if (status === ApplicationStatus.REJECTED) {
      application.rejectedAt = new Date();
      application.rejectedBy = adminId;
      application.rejectionReason = notes;
    } else if (status === ApplicationStatus.ACCEPTED) {
      application.acceptedAt = new Date();
      application.acceptedBy = adminId;
      application.acceptanceNotes = notes;
    }

    return await this.jobApplicationRepository.save(application);
  }

  async bulkUpdateApplications(applicationIds: number[], status: string, adminId: number, notes?: string) {
    const applications = await this.jobApplicationRepository.find({
      where: { id: In(applicationIds) }
    });
    
    for (const application of applications) {
      application.status = status as ApplicationStatus;
      
      if (status === ApplicationStatus.REJECTED) {
        application.rejectedAt = new Date();
        application.rejectedBy = adminId;
        application.rejectionReason = notes;
      } else if (status === ApplicationStatus.ACCEPTED) {
        application.acceptedAt = new Date();
        application.acceptedBy = adminId;
        application.acceptanceNotes = notes;
      }
    }

    return await this.jobApplicationRepository.save(applications);
  }

  // Purchase Management
  async getAllPurchases(page = 1, limit = 10) {
    const [purchases, total] = await this.mediaPurchaseRepository
      .createQueryBuilder('purchase')
      .leftJoinAndSelect('purchase.mediaContent', 'mediaContent')
      .leftJoinAndSelect('purchase.buyer', 'buyer')
      .leftJoinAndSelect('purchase.seller', 'seller')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('purchase.createdAt', 'DESC')
      .getManyAndCount();

    return {
      purchases,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Bulk Operations
  async bulkApproveJournalists(journalistIds: number[], approved: boolean, adminId: number) {
    const journalists = await this.journalistRepository.find({
      where: { id: In(journalistIds) }
    });
    
    for (const journalist of journalists) {
      journalist.isApproved = approved;
      journalist.approvedBy = adminId;
      journalist.approvedAt = new Date();
      
      if (approved && journalist.user) {
        journalist.user.status = UserStatus.ACTIVE;
        await this.userRepository.save(journalist.user);
      }
    }

    return await this.journalistRepository.save(journalists);
  }

  async bulkApproveCompanies(companyIds: number[], approved: boolean, adminId: number) {
    const companies = await this.companyRepository.find({
      where: { id: In(companyIds) }
    });
    
    for (const company of companies) {
      company.isVerified = approved;
      
      if (approved && company.user) {
        company.user.status = UserStatus.ACTIVE;
        await this.userRepository.save(company.user);
      }
    }

    return await this.companyRepository.save(companies);
  }

  async bulkApproveJobs(jobIds: number[], approved: boolean, adminId: number) {
    const jobs = await this.jobRepository.find({
      where: { id: In(jobIds) }
    });
    
    for (const job of jobs) {
      job.isApproved = approved;
      job.approvedBy = adminId;
      job.approvedAt = new Date();
      
      if (approved) {
        job.status = JobStatus.PUBLISHED;
      }
    }

    return await this.jobRepository.save(jobs);
  }

  async bulkApproveMediaContent(mediaIds: number[], approved: boolean, adminId: number) {
    const mediaContent = await this.mediaContentRepository.find({
      where: { id: In(mediaIds) }
    });
    
    for (const media of mediaContent) {
      media.isApproved = approved;
      media.approvedBy = adminId;
      media.approvedAt = new Date();
      
      if (approved) {
        media.status = MediaStatus.PUBLISHED;
      }
    }

    return await this.mediaContentRepository.save(mediaContent);
  }

  // Lookup Tables Management
  async getSkills(page = 1, limit = 50, search?: string) {
    const query = this.skillRepository.createQueryBuilder('skill');
    
    if (search) {
      query.andWhere('(skill.name LIKE :search OR skill.description LIKE :search)', { search: `%${search}%` });
    }

    const [skills, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('skill.name', 'ASC')
      .getManyAndCount();

    return {
      skills,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createSkill(createSkillDto: any) {
    const skill = this.skillRepository.create(createSkillDto);
    return await this.skillRepository.save(skill);
  }

  async updateSkill(id: number, updateSkillDto: any) {
    await this.skillRepository.update(id, updateSkillDto);
    return await this.skillRepository.findOne({ where: { id } });
  }

  async deleteSkill(id: number) {
    await this.skillRepository.update(id, { isActive: false });
  }

  async getCountries(page = 1, limit = 50, search?: string) {
    const query = this.countryRepository.createQueryBuilder('country');
    
    if (search) {
      query.andWhere('(country.name LIKE :search OR country.code LIKE :search)', { search: `%${search}%` });
    }

    const [countries, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('country.name', 'ASC')
      .getManyAndCount();

    return {
      countries,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createCountry(createCountryDto: any) {
    const country = this.countryRepository.create(createCountryDto);
    return await this.countryRepository.save(country);
  }

  async updateCountry(id: number, updateCountryDto: any) {
    await this.countryRepository.update(id, updateCountryDto);
    return await this.countryRepository.findOne({ where: { id } });
  }

  async deleteCountry(id: number) {
    await this.countryRepository.update(id, { isActive: false });
  }

  async getLanguages(page = 1, limit = 50, search?: string) {
    const query = this.languageRepository.createQueryBuilder('language');
    
    if (search) {
      query.andWhere('(language.name LIKE :search OR language.code LIKE :search OR language.nativeName LIKE :search)', { search: `%${search}%` });
    }

    const [languages, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('language.name', 'ASC')
      .getManyAndCount();

    return {
      languages,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createLanguage(createLanguageDto: any) {
    const language = this.languageRepository.create(createLanguageDto);
    return await this.languageRepository.save(language);
  }

  async updateLanguage(id: number, updateLanguageDto: any) {
    await this.languageRepository.update(id, updateLanguageDto);
    return await this.languageRepository.findOne({ where: { id } });
  }

  async deleteLanguage(id: number) {
    await this.languageRepository.update(id, { isActive: false });
  }

  async getAnalystSpecialties(page = 1, limit = 50, search?: string) {
    const query = this.analystSpecialtyRepository.createQueryBuilder('analystSpecialty');
    
    if (search) {
      query.andWhere('(analystSpecialty.name LIKE :search OR analystSpecialty.description LIKE :search)', { search: `%${search}%` });
    }

    const [analystSpecialties, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('analystSpecialty.name', 'ASC')
      .getManyAndCount();

    return {
      analystSpecialties,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createAnalystSpecialty(createAnalystSpecialtyDto: any) {
    const analystSpecialty = this.analystSpecialtyRepository.create(createAnalystSpecialtyDto);
    return await this.analystSpecialtyRepository.save(analystSpecialty);
  }

  async updateAnalystSpecialty(id: number, updateAnalystSpecialtyDto: any) {
    await this.analystSpecialtyRepository.update(id, updateAnalystSpecialtyDto);
    return await this.analystSpecialtyRepository.findOne({ where: { id } });
  }

  async deleteAnalystSpecialty(id: number) {
    await this.analystSpecialtyRepository.update(id, { isActive: false });
  }

  async getMediaWorkTypes(page = 1, limit = 50, search?: string) {
    const query = this.mediaWorkTypeRepository.createQueryBuilder('mediaWorkType');
    
    if (search) {
      query.andWhere('(mediaWorkType.name LIKE :search OR mediaWorkType.description LIKE :search)', { search: `%${search}%` });
    }

    const [mediaWorkTypes, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('mediaWorkType.name', 'ASC')
      .getManyAndCount();

    return {
      mediaWorkTypes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createMediaWorkType(createMediaWorkTypeDto: any) {
    const mediaWorkType = this.mediaWorkTypeRepository.create(createMediaWorkTypeDto);
    return await this.mediaWorkTypeRepository.save(mediaWorkType);
  }

  async updateMediaWorkType(id: number, updateMediaWorkTypeDto: any) {
    await this.mediaWorkTypeRepository.update(id, updateMediaWorkTypeDto);
    return await this.mediaWorkTypeRepository.findOne({ where: { id } });
  }

  async deleteMediaWorkType(id: number) {
    await this.mediaWorkTypeRepository.update(id, { isActive: false });
  }

  // User Management - Password Reset
  async resetUserPassword(userId: number, newPassword: string, adminId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.updatedAt = new Date();

    return await this.userRepository.save(user);
  }

  // Enhanced Statistics - Optimized to reduce database connections
  async getDetailedStatistics() {
    try {
      // Use fewer, more efficient queries
      const [
        userStats,
        journalistStats,
        companyStats,
        jobStats,
        applicationStats,
        mediaStats,
        purchaseStats,
      ] = await Promise.all([
        // User statistics in one query
        this.userRepository
          .createQueryBuilder('user')
          .select([
            'COUNT(*) as total',
            'SUM(CASE WHEN user.status = :active THEN 1 ELSE 0 END) as active',
            'SUM(CASE WHEN user.status = :pending THEN 1 ELSE 0 END) as pending',
            'SUM(CASE WHEN user.status = :suspended THEN 1 ELSE 0 END) as suspended'
          ])
          .setParameters({
            active: UserStatus.ACTIVE,
            pending: UserStatus.PENDING,
            suspended: UserStatus.SUSPENDED
          })
          .getRawOne(),
        
        // Journalist statistics
        this.journalistRepository
          .createQueryBuilder('journalist')
          .select([
            'COUNT(*) as total',
            'SUM(CASE WHEN journalist.isApproved = 1 THEN 1 ELSE 0 END) as approved',
            'SUM(CASE WHEN journalist.isApproved = 0 THEN 1 ELSE 0 END) as pending'
          ])
          .getRawOne(),
        
        // Company statistics
        this.companyRepository
          .createQueryBuilder('company')
          .select([
            'COUNT(*) as total',
            'SUM(CASE WHEN company.isVerified = 1 THEN 1 ELSE 0 END) as verified',
            'SUM(CASE WHEN company.isVerified = 0 THEN 1 ELSE 0 END) as pending'
          ])
          .getRawOne(),
        
        // Job statistics
        this.jobRepository
          .createQueryBuilder('job')
          .select([
            'COUNT(*) as total',
            'SUM(CASE WHEN job.status = :published THEN 1 ELSE 0 END) as published',
            'SUM(CASE WHEN job.status = :draft THEN 1 ELSE 0 END) as draft',
            'SUM(CASE WHEN job.status = :closed THEN 1 ELSE 0 END) as closed'
          ])
          .setParameters({
            published: JobStatus.PUBLISHED,
            draft: JobStatus.DRAFT,
            closed: JobStatus.CLOSED
          })
          .getRawOne(),
        
        // Application statistics
        this.jobApplicationRepository
          .createQueryBuilder('application')
          .select([
            'COUNT(*) as total',
            'SUM(CASE WHEN application.status = :pending THEN 1 ELSE 0 END) as pending',
            'SUM(CASE WHEN application.status = :accepted THEN 1 ELSE 0 END) as accepted',
            'SUM(CASE WHEN application.status = :rejected THEN 1 ELSE 0 END) as rejected'
          ])
          .setParameters({
            pending: ApplicationStatus.PENDING,
            accepted: ApplicationStatus.ACCEPTED,
            rejected: ApplicationStatus.REJECTED
          })
          .getRawOne(),
        
        // Media statistics
        this.mediaContentRepository
          .createQueryBuilder('media')
          .select([
            'COUNT(*) as total',
            'SUM(CASE WHEN media.isApproved = 1 THEN 1 ELSE 0 END) as approved',
            'SUM(CASE WHEN media.isApproved = 0 THEN 1 ELSE 0 END) as pending'
          ])
          .getRawOne(),
        
        // Purchase statistics
        this.mediaPurchaseRepository
          .createQueryBuilder('purchase')
          .select([
            'COUNT(*) as total',
            'COALESCE(SUM(purchase.amount), 0) as revenue'
          ])
          .getRawOne(),
      ]);

      // Parse the results
      const totalUsers = parseInt(userStats.total) || 0;
      const activeUsers = parseInt(userStats.active) || 0;
      const pendingUsers = parseInt(userStats.pending) || 0;
      const suspendedUsers = parseInt(userStats.suspended) || 0;
      
      const totalJournalists = parseInt(journalistStats.total) || 0;
      const approvedJournalists = parseInt(journalistStats.approved) || 0;
      const pendingJournalists = parseInt(journalistStats.pending) || 0;
      
      const totalCompanies = parseInt(companyStats.total) || 0;
      const verifiedCompanies = parseInt(companyStats.verified) || 0;
      const pendingCompanies = parseInt(companyStats.pending) || 0;
      
      const totalJobs = parseInt(jobStats.total) || 0;
      const publishedJobs = parseInt(jobStats.published) || 0;
      const draftJobs = parseInt(jobStats.draft) || 0;
      const closedJobs = parseInt(jobStats.closed) || 0;
      
      const totalApplications = parseInt(applicationStats.total) || 0;
      const pendingApplications = parseInt(applicationStats.pending) || 0;
      const acceptedApplications = parseInt(applicationStats.accepted) || 0;
      const rejectedApplications = parseInt(applicationStats.rejected) || 0;
      
      const totalMedia = parseInt(mediaStats.total) || 0;
      const approvedMedia = parseInt(mediaStats.approved) || 0;
      const pendingMedia = parseInt(mediaStats.pending) || 0;
      
      const totalPurchases = parseInt(purchaseStats.total) || 0;
      const revenue = parseFloat(purchaseStats.revenue) || 0;

    // Get monthly statistics for the last 12 months
    const monthlyStats = await this.getMonthlyStatistics();

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        pending: pendingUsers,
        suspended: suspendedUsers,
      },
      journalists: {
        total: totalJournalists,
        approved: approvedJournalists,
        pending: pendingJournalists,
      },
      companies: {
        total: totalCompanies,
        verified: verifiedCompanies,
        pending: pendingCompanies,
      },
      jobs: {
        total: totalJobs,
        published: publishedJobs,
        draft: draftJobs,
        closed: closedJobs,
      },
      applications: {
        total: totalApplications,
        pending: pendingApplications,
        accepted: acceptedApplications,
        rejected: rejectedApplications,
      },
      media: {
        total: totalMedia,
        approved: approvedMedia,
        pending: pendingMedia,
      },
      purchases: {
        total: totalPurchases,
        revenue: revenue,
      },
      monthly: monthlyStats,
    };
    } catch (error) {
      console.error('Error in getDetailedStatistics:', error);
      // Return default values if there's an error
      return {
        users: { total: 0, active: 0, pending: 0, suspended: 0 },
        journalists: { total: 0, approved: 0, pending: 0 },
        companies: { total: 0, verified: 0, pending: 0 },
        jobs: { total: 0, published: 0, draft: 0, closed: 0 },
        applications: { total: 0, pending: 0, accepted: 0, rejected: 0 },
        media: { total: 0, approved: 0, pending: 0 },
        purchases: { total: 0, revenue: 0 },
        monthly: [],
      };
    }
  }

  private async getMonthlyStatistics() {
    try {
      // Simplified monthly statistics to reduce database load
      // For now, return empty array to prevent connection issues
      // This can be implemented later with a more efficient approach
      return [];
    } catch (error) {
      console.error('Error in getMonthlyStatistics:', error);
      return [];
    }
  }
}

