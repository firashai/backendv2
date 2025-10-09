import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from './company.entity';
import { Language } from '../../languages/entities/language.entity';

export enum ImportanceLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

@Entity('company_required_languages')
export class CompanyRequiredLanguage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  companyId: number;

  @Column()
  languageId: number;

  @Column({
    type: 'enum',
    enum: ImportanceLevel,
    default: ImportanceLevel.MEDIUM
  })
  importanceLevel: ImportanceLevel;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Company, company => company.companyRequiredLanguages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @ManyToOne(() => Language, language => language.companyRequiredLanguages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'languageId' })
  language: Language;
}

