import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Journalist } from '../journalists/entities/journalist.entity';
import { Job } from '../jobs/entities/job.entity';
import { MediaContent } from '../media-content/entities/media-content.entity';
import { Company } from '../companies/entities/company.entity';
import { GlobalSearchDto } from './dto/global-search.dto';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Journalist)
    private readonly journalistRepository: Repository<Journalist>,
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(MediaContent)
    private readonly mediaContentRepository: Repository<MediaContent>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async globalSearch(searchDto: GlobalSearchDto) {
    const { query, filters, limit = 20, offset = 0 } = searchDto;

    console.log('Global search called with:', { query, filters, limit, offset });

    // Debug database content on first search
    if (query && query.trim() !== '') {
      await this.debugDatabaseContent();
    }

    const results = {
      journalists: [],
      jobs: [],
      mediaContent: [],
      companies: [],
    };

    // Search journalists
    if (!filters || filters.includes('journalists')) {
      console.log('Searching journalists...');
      results.journalists = await this.searchJournalists(query, limit, offset);
      console.log('Journalists found:', results.journalists.length);
    }

    // Search jobs
    if (!filters || filters.includes('jobs')) {
      console.log('Searching jobs...');
      results.jobs = await this.searchJobs(query, limit, offset);
      console.log('Jobs found:', results.jobs.length);
    }

    // Search media content
    if (!filters || filters.includes('mediaContent')) {
      console.log('Searching media content...');
      results.mediaContent = await this.searchMediaContent(query, limit, offset);
      console.log('Media content found:', results.mediaContent.length);
    }

    // Search companies
    if (!filters || filters.includes('companies')) {
      console.log('Searching companies...');
      results.companies = await this.searchCompanies(query, limit, offset);
      console.log('Companies found:', results.companies.length);
    }

    console.log('Total results:', {
      journalists: results.journalists.length,
      jobs: results.jobs.length,
      mediaContent: results.mediaContent.length,
      companies: results.companies.length,
    });

    return results;
  }

  async searchJournalists(query: string, limit: number, offset: number) {
    console.log('Searching journalists with query:', query);
    
    // Debug database content for journalists
    await this.debugJournalistsContent();
    
    // If no query provided, return all available journalists
    if (!query || query.trim() === '') {
      console.log('No query provided, returning all available journalists');
      return this.journalistRepository
        .createQueryBuilder('journalist')
        .leftJoinAndSelect('journalist.user', 'user')
        .where('user.status = :status', { status: 'active' })
        .andWhere('journalist.isAvailable = :isAvailable', { isAvailable: true })
        .orderBy('journalist.rating', 'DESC')
        .limit(limit)
        .offset(offset)
        .getMany();
    }
    
    console.log('Searching journalists with specific query:', query);
    
    return this.journalistRepository
      .createQueryBuilder('journalist')
      .leftJoinAndSelect('journalist.user', 'user')
      .where('user.status = :status', { status: 'active' })
      .andWhere('journalist.isAvailable = :isAvailable', { isAvailable: true })
      .andWhere(
        '(user.firstName LIKE :query OR user.lastName LIKE :query OR user.country LIKE :query OR user.city LIKE :query OR journalist.bio LIKE :query)',
        { query: `%${query}%` }
      )
      .orderBy('journalist.rating', 'DESC')
      .limit(limit)
      .offset(offset)
      .getMany();
  }

  async searchJobs(query: string, limit: number, offset: number) {
    console.log('Searching jobs with query:', query);
    
    // If no query provided, return all published jobs
    if (!query || query.trim() === '') {
      console.log('No query provided, returning all published jobs');
      return this.jobRepository
        .createQueryBuilder('job')
        .leftJoinAndSelect('job.company', 'company')
        .where('job.status = :status', { status: 'published' })
        .orderBy('job.isUrgent', 'DESC')
        .addOrderBy('job.createdAt', 'DESC')
        .limit(limit)
        .offset(offset)
        .getMany();
    }
    
    console.log('Searching jobs with specific query:', query);
    
    return this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company')
      .where('job.status = :status', { status: 'published' })
      .andWhere(
        '(job.title LIKE :query OR job.description LIKE :query OR company.name LIKE :query)',
        { query: `%${query}%` }
      )
      .orderBy('job.isUrgent', 'DESC')
      .addOrderBy('job.createdAt', 'DESC')
      .limit(limit)
      .offset(offset)
      .getMany();
  }

  async searchMediaContent(query: string, limit: number, offset: number) {
    console.log('Searching media content with query:', query);
    
    // If no query provided, return all published media content
    if (!query || query.trim() === '') {
      console.log('No query provided, returning all published media content');
      return this.mediaContentRepository
        .createQueryBuilder('mediaContent')
        .leftJoinAndSelect('mediaContent.journalist', 'journalist')
        .leftJoinAndSelect('journalist.user', 'user')
        .where('mediaContent.status = :status', { status: 'published' })
        .orderBy('mediaContent.rating', 'DESC')
        .limit(limit)
        .offset(offset)
        .getMany();
    }
    
    console.log('Searching media content with specific query:', query);
    
    return this.mediaContentRepository
      .createQueryBuilder('mediaContent')
      .leftJoinAndSelect('mediaContent.journalist', 'journalist')
      .leftJoinAndSelect('journalist.user', 'user')
      .where('mediaContent.status = :status', { status: 'published' })
      .andWhere(
        '(mediaContent.title LIKE :query OR mediaContent.description LIKE :query OR user.firstName LIKE :query OR user.lastName LIKE :query)',
        { query: `%${query}%` }
      )
      .orderBy('mediaContent.rating', 'DESC')
      .limit(limit)
      .offset(offset)
      .getMany();
  }

  async searchCompanies(query: string, limit: number, offset: number) {
    console.log('Searching companies with query:', query);
    
    // If no query provided, return all active companies
    if (!query || query.trim() === '') {
      console.log('No query provided, returning all active companies');
      return this.companyRepository
        .createQueryBuilder('company')
        .leftJoinAndSelect('company.user', 'user')
        .where('user.status = :status', { status: 'active' })
        .orderBy('company.rating', 'DESC')
        .limit(limit)
        .offset(offset)
        .getMany();
    }
    
    console.log('Searching companies with specific query:', query);
    
    return this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.user', 'user')
      .where('user.status = :status', { status: 'active' })
      .andWhere(
        '(company.name LIKE :query OR company.description LIKE :query OR user.country LIKE :query OR user.city LIKE :query)',
        { query: `%${query}%` }
      )
      .orderBy('company.rating', 'DESC')
      .limit(limit)
      .offset(offset)
      .getMany();
  }

  async searchMedia(query: string, limit: number, offset: number) {
    return this.searchMediaContent(query, limit, offset);
  }

  async searchJournalistsAdvanced(filters: any) {
    const {
      location,
      mediaWorkType,
      analystSpecialty,
      hasCamera,
      hasAudioEquipment,
      canTravel,
      skills,
      languages,
      rating,
      limit = 20,
      offset = 0,
    } = filters;

    const queryBuilder = this.journalistRepository
      .createQueryBuilder('journalist')
      .leftJoinAndSelect('journalist.user', 'user')
      .where('journalist.isAvailable = :isAvailable', { isAvailable: true })
      .andWhere('user.status = :status', { status: 'active' });

    if (location) {
      queryBuilder.andWhere(
        '(user.country LIKE :location OR user.city LIKE :location)',
        { location: `%${location}%` }
      );
    }

    if (mediaWorkType) {
      queryBuilder.andWhere('journalist.mediaWorkType = :mediaWorkType', { mediaWorkType });
    }

    if (analystSpecialty) {
      queryBuilder.andWhere('journalist.analystSpecialty = :analystSpecialty', { analystSpecialty });
    }

    if (hasCamera !== undefined) {
      queryBuilder.andWhere('journalist.hasCamera = :hasCamera', { hasCamera });
    }

    if (hasAudioEquipment !== undefined) {
      queryBuilder.andWhere('journalist.hasAudioEquipment = :hasAudioEquipment', { hasAudioEquipment });
    }

    if (canTravel !== undefined) {
      queryBuilder.andWhere('journalist.canTravel = :canTravel', { canTravel });
    }

    if (skills && skills.length > 0) {
      queryBuilder.andWhere('JSON_CONTAINS(journalist.skills, :skills)', { skills: JSON.stringify(skills) });
    }

    if (languages && languages.length > 0) {
      queryBuilder.andWhere('JSON_CONTAINS(journalist.languages, :languages)', { languages: JSON.stringify(languages) });
    }

    if (rating) {
      queryBuilder.andWhere('journalist.rating >= :rating', { rating });
    }

    queryBuilder
      .orderBy('journalist.rating', 'DESC')
      .addOrderBy('journalist.completedProjects', 'DESC')
      .limit(limit)
      .offset(offset);

    return queryBuilder.getMany();
  }

  async searchJobsAdvanced(filters: any) {
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
      .where('job.status = :status', { status: 'published' });

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

  async getSearchSuggestions(query: string) {
    const suggestions = {
      journalists: [],
      jobs: [],
      companies: [],
      skills: [],
      locations: [],
    };

    // Get journalist name suggestions
    suggestions.journalists = await this.journalistRepository
      .createQueryBuilder('journalist')
      .leftJoin('journalist.user', 'user')
      .select('CONCAT(user.firstName, " ", user.lastName) as name')
      .where('user.firstName LIKE :query OR user.lastName LIKE :query', { query: `%${query}%` })
      .limit(5)
      .getRawMany();

    // Get job title suggestions
    suggestions.jobs = await this.jobRepository
      .createQueryBuilder('job')
      .select('job.title')
      .where('job.title LIKE :query', { query: `%${query}%` })
      .limit(5)
      .getRawMany();

    // Get company name suggestions
    suggestions.companies = await this.companyRepository
      .createQueryBuilder('company')
      .select('company.name')
      .where('company.name LIKE :query', { query: `%${query}%` })
      .limit(5)
      .getRawMany();

    return suggestions;
  }

  // Debug method to check database content
  async debugDatabaseContent() {
    console.log('=== DEBUG: Checking database content ===');
    
    try {
      const totalJournalists = await this.journalistRepository.count();
      const totalJobs = await this.jobRepository.count();
      const totalMedia = await this.mediaContentRepository.count();
      const totalCompanies = await this.companyRepository.count();
      
      console.log('Total records:', {
        journalists: totalJournalists,
        jobs: totalJobs,
        media: totalMedia,
        companies: totalCompanies
      });

      // Get sample data
      const sampleJournalists = await this.journalistRepository
        .createQueryBuilder('journalist')
        .leftJoinAndSelect('journalist.user', 'user')
        .limit(2)
        .getMany();
      
      console.log('Sample journalists:', sampleJournalists.map(j => ({
        id: j.id,
        firstName: j.user?.firstName,
        lastName: j.user?.lastName,
        country: j.user?.country,
        isAvailable: j.isAvailable,
        userStatus: j.user?.status
      })));

      const sampleJobs = await this.jobRepository
        .createQueryBuilder('job')
        .leftJoinAndSelect('job.company', 'company')
        .limit(2)
        .getMany();
      
      console.log('Sample jobs:', sampleJobs.map(j => ({
        id: j.id,
        title: j.title,
        status: j.status,
        companyName: j.company?.name
      })));

    } catch (error) {
      console.error('Error checking database content:', error);
    }
    
    console.log('=== END DEBUG ===');
  }

  // Debug method specifically for journalists
  async debugJournalistsContent() {
    console.log('=== DEBUG: Checking journalists content ===');
    
    try {
      const totalJournalists = await this.journalistRepository.count();
      console.log('Total journalists:', totalJournalists);

      // Get all journalists with their user data
      const allJournalists = await this.journalistRepository
        .createQueryBuilder('journalist')
        .leftJoinAndSelect('journalist.user', 'user')
        .getMany();
      
      console.log('All journalists with user data:', allJournalists.map(j => ({
        id: j.id,
        userId: j.user?.id,
        firstName: j.user?.firstName,
        lastName: j.user?.lastName,
        email: j.user?.email,
        country: j.user?.country,
        city: j.user?.city,
        status: j.user?.status,
        isAvailable: j.isAvailable,
        bio: j.bio
      })));

      // Check for active users with journalist role
      const activeJournalistUsers = await this.journalistRepository
        .createQueryBuilder('journalist')
        .leftJoinAndSelect('journalist.user', 'user')
        .where('user.status = :status', { status: 'active' })
        .andWhere('journalist.isAvailable = :isAvailable', { isAvailable: true })
        .getMany();
      
      console.log('Active available journalists:', activeJournalistUsers.length);
      console.log('Active available journalists details:', activeJournalistUsers.map(j => ({
        id: j.id,
        firstName: j.user?.firstName,
        lastName: j.user?.lastName,
        country: j.user?.country
      })));

    } catch (error) {
      console.error('Error checking journalists content:', error);
    }
    
    console.log('=== END JOURNALISTS DEBUG ===');
  }
}
