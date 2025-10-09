import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from './entities/skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private skillsRepository: Repository<Skill>,
  ) {}

  async create(createSkillDto: CreateSkillDto): Promise<Skill> {
    const skill = this.skillsRepository.create(createSkillDto);
    return await this.skillsRepository.save(skill);
  }

  async findAll(): Promise<Skill[]> {
    return await this.skillsRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' }
    });
  }

  async findByCategory(category: string): Promise<Skill[]> {
    return await this.skillsRepository.find({
      where: { category, isActive: true },
      order: { name: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Skill> {
    return await this.skillsRepository.findOne({
      where: { id }
    });
  }

  async update(id: number, updateSkillDto: UpdateSkillDto): Promise<Skill> {
    await this.skillsRepository.update(id, updateSkillDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.skillsRepository.update(id, { isActive: false });
  }

  async search(query: string): Promise<Skill[]> {
    return await this.skillsRepository
      .createQueryBuilder('skill')
      .where('skill.isActive = :isActive', { isActive: true })
      .andWhere('(skill.name LIKE :query OR skill.description LIKE :query)', { query: `%${query}%` })
      .orderBy('skill.name', 'ASC')
      .getMany();
  }
}

