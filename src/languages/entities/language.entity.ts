import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { JournalistLanguage } from '../../journalists/entities/journalist-language.entity';
import { CompanyRequiredLanguage } from '../../companies/entities/company-required-language.entity';
import { JobRequiredLanguage } from '../../jobs/entities/job-required-language.entity';

@Entity('languages')
export class Language {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ length: 5, unique: true })
  code: string;

  @Column({ nullable: true })
  nativeName: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => JournalistLanguage, journalistLanguage => journalistLanguage.language)
  journalistLanguages: JournalistLanguage[];

  @OneToMany(() => CompanyRequiredLanguage, companyRequiredLanguage => companyRequiredLanguage.language)
  companyRequiredLanguages: CompanyRequiredLanguage[];

  @OneToMany(() => JobRequiredLanguage, jobRequiredLanguage => jobRequiredLanguage.language)
  jobRequiredLanguages: JobRequiredLanguage[];
}

