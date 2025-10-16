import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { JobRequiredSkill } from './job-required-skill.entity';
import { JobRequiredLanguage } from './job-required-language.entity';
import { JobMediaWorkType } from './job-media-work-type.entity';
import { JobLocation } from './job-location.entity';

export enum JobType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  FREELANCE = 'freelance',
  CONTRACT = 'contract',
  INTERNSHIP = 'internship',
}

export enum JobStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CLOSED = 'closed',
  FILLED = 'filled',
  EXPIRED = 'expired',
}

export enum ExperienceLevel {
  ENTRY = 'entry',
  JUNIOR = 'junior',
  MID = 'mid',
  SENIOR = 'senior',
  EXPERT = 'expert',
}

@Entity('jobs')
export class Job {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column({ type: 'text' })
  description: string;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: JobType,
  })
  jobType: JobType;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.DRAFT,
  })
  status: JobStatus;

  // Removed mediaWorkType and analystSpecialty columns - now handled by junction tables

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: ExperienceLevel,
  })
  experienceLevel: ExperienceLevel;

  // Removed requiredSkills, preferredSkills, requiredLanguages, preferredLanguages, locations - now handled by junction tables

  @ApiProperty()
  @Column({ type: 'json', nullable: true })
  salary: {
    min: number;
    max: number;
    currency: string;
    period: string;
    isNegotiable: boolean;
  };

  @ApiProperty()
  @Column({ type: 'json', nullable: true })
  benefits: string[];

  @ApiProperty()
  @Column({ type: 'json', nullable: true })
  requirements: {
    hasCamera: boolean;
    cameraType?: string;
    hasAudioEquipment: boolean;
    audioEquipmentType?: string;
    canTravel: boolean;
    certifications?: string[];
    portfolio?: boolean;
  };

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  projectDetails: string;

  @ApiProperty()
  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @ApiProperty()
  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @ApiProperty()
  @Column({ type: 'date', nullable: true })
  applicationDeadline: Date;

  @ApiProperty()
  @Column({ default: 1 })
  numberOfPositions: number;

  @ApiProperty()
  @Column({ default: 0 })
  applicationsCount: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  averageBid: number;

  @ApiProperty()
  @Column({ default: 0 })
  viewsCount: number;

  @ApiProperty()
  @Column({ type: 'json', nullable: true })
  tags: string[];

  @ApiProperty()
  @Column({ type: 'json', nullable: true })
  categories: string[];

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  additionalInfo: string;

  @ApiProperty()
  @Column({ type: 'json', nullable: true })
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    preferredContact: string;
  };

  @ApiProperty()
  @Column({ default: false })
  isUrgent: boolean;

  @ApiProperty()
  @Column({ default: false })
  isFeatured: boolean;

  @ApiProperty()
  @Column({ default: false })
  isVerified: boolean;

  @ApiProperty()
  @Column({ default: false })
  isApproved: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  approvedBy: number;

  @ApiProperty()
  @Column({ nullable: true })
  approvedAt: Date;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  approvalNotes: string;

  @ApiProperty()
  @Column({ type: 'json', nullable: true })
  applicationQuestions: {
    question: string;
    type: string;
    required: boolean;
  }[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @Column({ nullable: true })
  companyId: number;

  @ApiProperty()
  @Column({ nullable: true })
  postedByUserId: number;

  // Relations
  @ManyToOne('Company', 'jobs')
  @JoinColumn({ name: 'companyId' })
  company: any;

  @ManyToOne('User', 'postedJobs')
  @JoinColumn({ name: 'postedByUserId' })
  postedBy: any;

  @OneToMany('JobApplication', 'job')
  applications: any[];

  @OneToMany(() => JobRequiredSkill, jobRequiredSkill => jobRequiredSkill.job)
  jobRequiredSkills: JobRequiredSkill[];

  @OneToMany(() => JobRequiredLanguage, jobRequiredLanguage => jobRequiredLanguage.job)
  jobRequiredLanguages: JobRequiredLanguage[];

  @OneToMany(() => JobMediaWorkType, jobMediaWorkType => jobMediaWorkType.job)
  jobMediaWorkTypes: JobMediaWorkType[];

  @OneToMany(() => JobLocation, jobLocation => jobLocation.job)
  jobLocations: JobLocation[];
}

// Import these entities to avoid circular dependency issues
import { Company } from '../../companies/entities/company.entity';
import { JobApplication } from './job-application.entity';
