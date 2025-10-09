import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Language } from './entities/language.entity';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';

@Injectable()
export class LanguagesService {
  constructor(
    @InjectRepository(Language)
    private languagesRepository: Repository<Language>,
  ) {}

  async create(createLanguageDto: CreateLanguageDto): Promise<Language> {
    const language = this.languagesRepository.create(createLanguageDto);
    return await this.languagesRepository.save(language);
  }

  async findAll(): Promise<Language[]> {
    return await this.languagesRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' }
    });
  }

  async findByCode(code: string): Promise<Language> {
    return await this.languagesRepository.findOne({
      where: { code }
    });
  }

  async findOne(id: number): Promise<Language> {
    return await this.languagesRepository.findOne({
      where: { id }
    });
  }

  async update(id: number, updateLanguageDto: UpdateLanguageDto): Promise<Language> {
    await this.languagesRepository.update(id, updateLanguageDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.languagesRepository.update(id, { isActive: false });
  }

  async search(query: string): Promise<Language[]> {
    return await this.languagesRepository
      .createQueryBuilder('language')
      .where('language.isActive = :isActive', { isActive: true })
      .andWhere('(language.name LIKE :query OR language.code LIKE :query OR language.nativeName LIKE :query)', { query: `%${query}%` })
      .orderBy('language.name', 'ASC')
      .getMany();
  }
}

