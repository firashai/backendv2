import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnalystSpecialty } from './entities/analyst-specialty.entity';
import { CreateAnalystSpecialtyDto } from './dto/create-analyst-specialty.dto';
import { UpdateAnalystSpecialtyDto } from './dto/update-analyst-specialty.dto';

@Injectable()
export class AnalystSpecialtyService {
  constructor(
    @InjectRepository(AnalystSpecialty)
    private analystSpecialtyRepository: Repository<AnalystSpecialty>,
  ) {}

  async create(createAnalystSpecialtyDto: CreateAnalystSpecialtyDto): Promise<AnalystSpecialty> {
    const analystSpecialty = this.analystSpecialtyRepository.create(createAnalystSpecialtyDto);
    return await this.analystSpecialtyRepository.save(analystSpecialty);
  }

  async findAll(): Promise<AnalystSpecialty[]> {
    return await this.analystSpecialtyRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' }
    });
  }

  async findOne(id: number): Promise<AnalystSpecialty> {
    return await this.analystSpecialtyRepository.findOne({
      where: { id }
    });
  }

  async update(id: number, updateAnalystSpecialtyDto: UpdateAnalystSpecialtyDto): Promise<AnalystSpecialty> {
    await this.analystSpecialtyRepository.update(id, updateAnalystSpecialtyDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.analystSpecialtyRepository.update(id, { isActive: false });
  }

  async search(query: string): Promise<AnalystSpecialty[]> {
    return await this.analystSpecialtyRepository
      .createQueryBuilder('analystSpecialty')
      .where('analystSpecialty.isActive = :isActive', { isActive: true })
      .andWhere('(analystSpecialty.name LIKE :query OR analystSpecialty.description LIKE :query)', { query: `%${query}%` })
      .orderBy('analystSpecialty.name', 'ASC')
      .getMany();
  }
}

