import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';

import { Journalist } from './entities/journalist.entity';
import { CreateJournalistDto } from './dto/create-journalist.dto';
import { UpdateJournalistDto } from './dto/update-journalist.dto';
import { SearchJournalistDto } from './dto/search-journalist.dto';
import { MediaWorkType, AnalystSpecialty } from './entities/journalist.entity';
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
    if (searchDto) {
      return this.search(searchDto);
    }
    
    return this.journalistRepository.find({
      relations: ['user', 'mediaContent'],
    });
  }

  async findOne(id: number): Promise<Journalist> {
    const journalist = await this.journalistRepository.findOne({
      where: { id },
      relations: ['user', 'mediaContent'],
    });

    if (!journalist) {
      throw new NotFoundException(`Journalist with ID ${id} not found`);
    }

    return journalist;
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
      skills,
      languages,
      limit = 20,
      offset = 0,
    } = searchDto;

    const queryBuilder = this.journalistRepository
      .createQueryBuilder('journalist')
      .leftJoinAndSelect('journalist.user', 'user')
      .leftJoinAndSelect('journalist.mediaContent', 'mediaContent')
      .where('journalist.isAvailable = :isAvailable', { isAvailable: true })
      .andWhere('user.status = :status', { status: 'active' });

    if (location) {
      queryBuilder.andWhere(
        '(journalist.country LIKE :location OR journalist.cityOfResidence LIKE :location)',
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

    if (canTravel !== undefined) {
      queryBuilder.andWhere('journalist.canTravel = :canTravel', { canTravel });
    }

    if (skills && skills.length > 0) {
      queryBuilder.andWhere('JSON_CONTAINS(journalist.skills, :skills)', { skills: JSON.stringify(skills) });
    }

    if (languages && languages.length > 0) {
      queryBuilder.andWhere('JSON_CONTAINS(journalist.languages, :languages)', { languages: JSON.stringify(languages) });
    }

    queryBuilder
      .orderBy('journalist.rating', 'DESC')
      .addOrderBy('journalist.completedProjects', 'DESC')
      .limit(limit)
      .offset(offset);

    return queryBuilder.getMany();
  }

  async getTopRated(limit: number = 10): Promise<Journalist[]> {
    return this.journalistRepository.find({
      relations: ['user'],
      where: { isAvailable: true },
      order: { rating: 'DESC', completedProjects: 'DESC' },
      take: limit,
    });
  }

  async getByMediaWorkType(mediaWorkType: MediaWorkType): Promise<Journalist[]> {
    return this.journalistRepository.find({
      relations: ['user'],
      where: { 
        mediaWorkType,
        isAvailable: true,
      },
      order: { rating: 'DESC' },
    });
  }

  async getByLocation(country: string, city?: string): Promise<Journalist[]> {
    const whereCondition: any = { 
      country,
      isAvailable: true,
    };

    if (city) {
      whereCondition.cityOfResidence = city;
    }

    return this.journalistRepository.find({
      relations: ['user'],
      where: whereCondition,
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
}
