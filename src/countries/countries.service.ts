import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './entities/country.entity';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private countriesRepository: Repository<Country>,
  ) {}

  async create(createCountryDto: CreateCountryDto): Promise<Country> {
    const country = this.countriesRepository.create(createCountryDto);
    return await this.countriesRepository.save(country);
  }

  async findAll(): Promise<Country[]> {
    return await this.countriesRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' }
    });
  }

  async findByCode(code: string): Promise<Country> {
    return await this.countriesRepository.findOne({
      where: { code }
    });
  }

  async findOne(id: number): Promise<Country> {
    return await this.countriesRepository.findOne({
      where: { id }
    });
  }

  async update(id: number, updateCountryDto: UpdateCountryDto): Promise<Country> {
    await this.countriesRepository.update(id, updateCountryDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.countriesRepository.update(id, { isActive: false });
  }

  async search(query: string): Promise<Country[]> {
    return await this.countriesRepository
      .createQueryBuilder('country')
      .where('country.isActive = :isActive', { isActive: true })
      .andWhere('(country.name LIKE :query OR country.code LIKE :query)', { query: `%${query}%` })
      .orderBy('country.name', 'ASC')
      .getMany();
  }
}

