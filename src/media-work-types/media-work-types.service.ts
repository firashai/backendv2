import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaWorkType } from './entities/media-work-type.entity';
import { CreateMediaWorkTypeDto } from './dto/create-media-work-type.dto';
import { UpdateMediaWorkTypeDto } from './dto/update-media-work-type.dto';

@Injectable()
export class MediaWorkTypesService {
  constructor(
    @InjectRepository(MediaWorkType)
    private mediaWorkTypesRepository: Repository<MediaWorkType>,
  ) {}

  async create(createMediaWorkTypeDto: CreateMediaWorkTypeDto): Promise<MediaWorkType> {
    const mediaWorkType = this.mediaWorkTypesRepository.create(createMediaWorkTypeDto);
    return await this.mediaWorkTypesRepository.save(mediaWorkType);
  }

  async findAll(): Promise<MediaWorkType[]> {
    return await this.mediaWorkTypesRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' }
    });
  }

  async findOne(id: number): Promise<MediaWorkType> {
    return await this.mediaWorkTypesRepository.findOne({
      where: { id }
    });
  }

  async update(id: number, updateMediaWorkTypeDto: UpdateMediaWorkTypeDto): Promise<MediaWorkType> {
    await this.mediaWorkTypesRepository.update(id, updateMediaWorkTypeDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.mediaWorkTypesRepository.update(id, { isActive: false });
  }

  async search(query: string): Promise<MediaWorkType[]> {
    return await this.mediaWorkTypesRepository
      .createQueryBuilder('mediaWorkType')
      .where('mediaWorkType.isActive = :isActive', { isActive: true })
      .andWhere('(mediaWorkType.name LIKE :query OR mediaWorkType.description LIKE :query)', { query: `%${query}%` })
      .orderBy('mediaWorkType.name', 'ASC')
      .getMany();
  }
}

