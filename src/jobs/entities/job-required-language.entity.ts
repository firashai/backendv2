import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Job } from './job.entity';
import { Language } from '../../languages/entities/language.entity';

export enum ImportanceLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

@Entity('job_required_languages')
export class JobRequiredLanguage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  jobId: number;

  @Column()
  languageId: number;

  @Column({ default: true })
  isRequired: boolean;

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
  @ManyToOne(() => Job, job => job.jobRequiredLanguages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'jobId' })
  job: Job;

  @ManyToOne(() => Language, language => language.jobRequiredLanguages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'languageId' })
  language: Language;
}

