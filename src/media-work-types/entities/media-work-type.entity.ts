import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { JournalistMediaWorkType } from '../../journalists/entities/journalist-media-work-type.entity';
import { JobMediaWorkType } from '../../jobs/entities/job-media-work-type.entity';

@Entity('media_work_types')
export class MediaWorkType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => JournalistMediaWorkType, journalistMediaWorkType => journalistMediaWorkType.mediaWorkType)
  journalistMediaWorkTypes: JournalistMediaWorkType[];

  @OneToMany(() => JobMediaWorkType, jobMediaWorkType => jobMediaWorkType.mediaWorkType)
  jobMediaWorkTypes: JobMediaWorkType[];
}

