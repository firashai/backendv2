import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { MediaWorkType } from '../../media-work-types/entities/media-work-type.entity';
import { AnalystSpecialty } from '../../analyst-specialty/entities/analyst-specialty.entity';

export enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWING = 'reviewing',
  SHORTLISTED = 'shortlisted',
  INTERVIEWED = 'interviewed',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
}

@Entity('job_applications')
export class JobApplication {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'text' })
  coverLetter: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  resumeUrl: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  resumeFilename: string;

  @ApiProperty()
  @Column({ type: 'int', nullable: true })
  resumeSize: number;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  portfolio: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  samples: string;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  proposedRate: number;

  @ApiProperty()
  @Column({ nullable: true })
  proposedRateCurrency: string;

  @ApiProperty()
  @Column({ nullable: true })
  proposedRatePeriod: string;

  @ApiProperty()
  @Column({ type: 'date', nullable: true })
  availableStartDate: Date;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  availability: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  answers: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  references: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  additionalInfo: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  skills: string;

  @ApiProperty()
  @Column({ nullable: true })
  mediaWorkTypeId: number;

  @ApiProperty()
  @Column({ nullable: true })
  jobId: number;

  @ApiProperty()
  @Column({ nullable: true })
  journalistId: number;

  @ApiProperty()
  @Column({ nullable: true })
  companyId: number;

  @ApiProperty()
  @Column({ nullable: true })
  analystSpecialtyId: number;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  equipment: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  experience: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  education: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  notes: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  @ApiProperty()
  @Column({ nullable: true })
  rejectedAt: Date;

  @ApiProperty()
  @Column({ nullable: true })
  rejectedBy: number;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  acceptanceNotes: string;

  @ApiProperty()
  @Column({ nullable: true })
  acceptedAt: Date;

  @ApiProperty()
  @Column({ nullable: true })
  acceptedBy: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations - temporarily commented out to test direct column insertion
  // @ManyToOne('Job', 'applications')
  // @JoinColumn({ name: 'jobId' })
  // job: any;

  // @ManyToOne('Journalist', 'jobApplications')
  // @JoinColumn({ name: 'journalistId' })
  // journalist: any;

  // @ManyToOne('Company', 'applications')
  // @JoinColumn({ name: 'companyId' })
  // company: any;

  @ManyToOne(() => MediaWorkType, mediaWorkType => mediaWorkType.jobApplications)
  @JoinColumn({ name: 'mediaWorkTypeId' })
  mediaWorkType: MediaWorkType;

  @ManyToOne(() => AnalystSpecialty, analystSpecialty => analystSpecialty.jobApplications)
  @JoinColumn({ name: 'analystSpecialtyId' })
  analystSpecialty: AnalystSpecialty;
}
