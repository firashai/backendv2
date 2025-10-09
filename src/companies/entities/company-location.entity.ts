import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from './company.entity';
import { Country } from '../../countries/entities/country.entity';

@Entity('company_locations')
export class CompanyLocation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  companyId: number;

  @Column()
  countryId: number;

  @Column({ nullable: true })
  city: string;

  @Column({ default: false })
  isHeadquarter: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Company, company => company.companyLocations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @ManyToOne(() => Country, country => country.companyLocations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'countryId' })
  country: Country;
}

