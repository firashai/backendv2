import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Job } from './job.entity';
import { MediaWorkType } from '../../media-work-types/entities/media-work-type.entity';

@Entity('job_media_work_types')
export class JobMediaWorkType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  jobId: number;

  @Column()
  mediaWorkTypeId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Job, job => job.jobMediaWorkTypes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'jobId' })
  job: Job;

  @ManyToOne(() => MediaWorkType, mediaWorkType => mediaWorkType.jobMediaWorkTypes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'mediaWorkTypeId' })
  mediaWorkType: MediaWorkType;
}

