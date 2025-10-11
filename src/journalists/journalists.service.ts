import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';

import { Journalist } from './entities/journalist.entity';
import { CreateJournalistDto } from './dto/create-journalist.dto';
import { UpdateJournalistDto } from './dto/update-journalist.dto';
import { SearchJournalistDto } from './dto/search-journalist.dto';
import { AnalystSpecialty } from './entities/journalist.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class JournalistsService {
  constructor(
    @InjectRepository(Journalist)
    private readonly journalistRepository: Repository<Journalist>,
  ) {}

  async create(createJournalistDto: CreateJournalistDto): Promise<Journalist> {
    const journalist = this.journalistRepository.create(createJournalistDto);
    return this.journalistRepository.save(journalist);
  }

  async findAll(searchDto?: SearchJournalistDto): Promise<Journalist[]> {
    if (searchDto && (searchDto.location || searchDto.mediaWorkType || searchDto.analystSpecialty || searchDto.skills || searchDto.languages || searchDto.skill)) {
      return this.search(searchDto);
    }
    
    const queryBuilder = this.journalistRepository.createQueryBuilder('journalist')
      .leftJoinAndSelect('journalist.user', 'user')
      .leftJoinAndSelect('user.country', 'country')
      .leftJoinAndSelect('journalist.mediaContent', 'mediaContent')
      .leftJoinAndSelect('journalist.journalistSkills', 'journalistSkills')
      .leftJoinAndSelect('journalistSkills.skill', 'skill')
      .leftJoinAndSelect('journalist.journalistMediaWorkTypes', 'journalistMediaWorkTypes')
      .leftJoinAndSelect('journalistMediaWorkTypes.mediaWorkType', 'mediaWorkType')
      .leftJoinAndSelect('journalist.journalistLanguages', 'journalistLanguages')
      .leftJoinAndSelect('journalistLanguages.language', 'language')
      .where('journalist.isAvailable = :isAvailable', { isAvailable: true })
      .andWhere('user.status = :status', { status: 'active' })
      .orderBy('journalist.createdAt', 'DESC');

    if (searchDto?.limit) {
      queryBuilder.limit(searchDto.limit);
    }

    const journalists = await queryBuilder.getMany();
    
    // Transform the data to match frontend expectations
    return journalists.map(journalist => this.transformJournalistData(journalist));
  }

  async findOne(id: number): Promise<Journalist> {
    const journalist = await this.journalistRepository.findOne({
      where: { id },
      relations: [
        'user', 
        'user.country',
        'mediaContent',
        'journalistSkills',
        'journalistSkills.skill',
        'journalistMediaWorkTypes',
        'journalistMediaWorkTypes.mediaWorkType',
        'journalistLanguages',
        'journalistLanguages.language'
      ],
    });

    if (!journalist) {
      throw new NotFoundException(`Journalist with ID ${id} not found`);
    }

    // Transform the data to match frontend expectations
    return this.transformJournalistData(journalist);
  }

  async findByUserId(userId: number): Promise<Journalist> {
    const journalist = await this.journalistRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'mediaContent'],
    });

    if (!journalist) {
      throw new NotFoundException(`Journalist with user ID ${userId} not found`);
    }

    return journalist;
  }

  async update(id: number, updateJournalistDto: UpdateJournalistDto, user: User): Promise<Journalist> {
    const journalist = await this.findOne(id);
    
    // Check if user owns this journalist profile
    if (journalist.user.id !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You can only update your own journalist profile');
    }
    
    Object.assign(journalist, updateJournalistDto);
    return this.journalistRepository.save(journalist);
  }

  async remove(id: number, user: User): Promise<void> {
    const journalist = await this.findOne(id);
    
    // Check if user owns this journalist profile
    if (journalist.user.id !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You can only delete your own journalist profile');
    }
    
    await this.journalistRepository.remove(journalist);
  }

  // User-specific management methods
  async getMyProfile(userId: number): Promise<Journalist> {
    return this.findByUserId(userId);
  }

  async updateMyProfile(userId: number, updateJournalistDto: UpdateJournalistDto): Promise<Journalist> {
    const journalist = await this.findByUserId(userId);
    Object.assign(journalist, updateJournalistDto);
    return this.journalistRepository.save(journalist);
  }

  async getMyMediaContent(userId: number): Promise<Journalist> {
    return this.journalistRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'mediaContent'],
    });
  }

  async getMyApplications(userId: number): Promise<Journalist> {
    return this.journalistRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'jobApplications', 'jobApplications.job'],
    });
  }



  async search(searchDto: SearchJournalistDto): Promise<Journalist[]> {
    const {
      location,
      mediaWorkType,
      analystSpecialty,
      hasCamera,
      canTravel,
      skill,
      skills,
      languages,
      limit = 20,
      offset = 0,
    } = searchDto;

    const queryBuilder = this.journalistRepository
      .createQueryBuilder('journalist')
      .leftJoinAndSelect('journalist.user', 'user')
      .leftJoinAndSelect('user.country', 'country')
      .leftJoinAndSelect('journalist.mediaContent', 'mediaContent')
      .leftJoinAndSelect('journalist.journalistSkills', 'journalistSkills')
      .leftJoinAndSelect('journalistSkills.skill', 'skill')
      .leftJoinAndSelect('journalist.journalistMediaWorkTypes', 'journalistMediaWorkTypes')
      .leftJoinAndSelect('journalistMediaWorkTypes.mediaWorkType', 'mediaWorkType')
      .leftJoinAndSelect('journalist.journalistLanguages', 'journalistLanguages')
      .leftJoinAndSelect('journalistLanguages.language', 'language')
      .where('journalist.isAvailable = :isAvailable', { isAvailable: true })
      .andWhere('user.status = :status', { status: 'active' });

    if (location) {
      queryBuilder.andWhere('country.name LIKE :location', { location: `%${location}%` });
    }

    if (mediaWorkType) {
      queryBuilder.andWhere('mediaWorkType.name = :mediaWorkType', { mediaWorkType });
    }

    if (analystSpecialty) {
      queryBuilder.andWhere('journalist.analystSpecialty = :analystSpecialty', { analystSpecialty });
    }

    if (hasCamera !== undefined) {
      queryBuilder.andWhere('journalist.hasCamera = :hasCamera', { hasCamera });
    }

    if (canTravel !== undefined) {
      queryBuilder.andWhere('journalist.canTravel = :canTravel', { canTravel });
    }

    // Handle both single skill and skills array
    const skillsToSearch = skill ? [skill] : (skills || []);
    if (skillsToSearch.length > 0) {
      queryBuilder.andWhere(
        skillsToSearch.map((_, idx) => `skill.name = :skill${idx}`).join(' OR '),
        Object.fromEntries(skillsToSearch.map((s, idx) => [`skill${idx}`, s] as const))
      );
    }

    if (languages && languages.length > 0) {
      queryBuilder.andWhere(
        languages.map((_, idx) => `language.name = :language${idx}`).join(' OR '),
        Object.fromEntries(languages.map((l, idx) => [`language${idx}`, l] as const))
      );
    }

    queryBuilder
      .orderBy('journalist.rating', 'DESC')
      .addOrderBy('journalist.completedProjects', 'DESC')
      .limit(limit)
      .offset(offset);

    const journalists = await queryBuilder.getMany();
    
    // Transform the data to match frontend expectations
    return journalists.map(journalist => this.transformJournalistData(journalist));
  }

  async getTopRated(limit: number = 10): Promise<Journalist[]> {
    return this.journalistRepository.find({
      relations: ['user'],
      where: { isAvailable: true },
      order: { rating: 'DESC', completedProjects: 'DESC' },
      take: limit,
    });
  }

  // mediaWorkType filtering moved to junction tables; method retained for compatibility but returns available journalists
  async getByMediaWorkType(): Promise<Journalist[]> {
    return this.journalistRepository.find({
      relations: ['user'],
      where: { isAvailable: true },
      order: { rating: 'DESC' },
    });
  }

  // country/city now live on related user or junctions; simplify until new filters are implemented
  async getByLocation(): Promise<Journalist[]> {
    return this.journalistRepository.find({
      relations: ['user'],
      where: { isAvailable: true },
      order: { rating: 'DESC' },
    });
  }

  async updateRating(id: number, newRating: number): Promise<Journalist> {
    const journalist = await this.findOne(id);
    
    const totalRating = journalist.rating * journalist.totalReviews + newRating;
    journalist.totalReviews += 1;
    journalist.rating = totalRating / journalist.totalReviews;

    return this.journalistRepository.save(journalist);
  }

  async updateCompletedProjects(id: number): Promise<Journalist> {
    const journalist = await this.findOne(id);
    journalist.completedProjects += 1;
    return this.journalistRepository.save(journalist);
  }

  private transformJournalistData(journalist: Journalist): Journalist {
    // Transform junction table data to match frontend expectations
    const transformed = { ...journalist };
    
    // Transform journalistSkills to skills
    if (journalist.journalistSkills) {
      transformed.skills = journalist.journalistSkills.map(js => js.skill);
    }
    
    // Transform journalistMediaWorkTypes to mediaWorkTypes
    if (journalist.journalistMediaWorkTypes) {
      transformed.mediaWorkTypes = journalist.journalistMediaWorkTypes.map(jmwt => jmwt.mediaWorkType);
    }
    
    // Transform journalistLanguages to languages
    if (journalist.journalistLanguages) {
      transformed.languages = journalist.journalistLanguages.map(jl => jl.language);
    }
    
    return transformed;
  }
}
