import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Job } from './job.entity';
import { Country } from '../../countries/entities/country.entity';

@Entity('job_locations')
export class JobLocation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  jobId: number;

  @Column()
  countryId: number;

  @Column({ nullable: true })
  city: string;

  @Column({ default: false })
  isRemote: boolean;

  @Column({ default: false })
  travelRequired: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Job, job => job.jobLocations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'jobId' })
  job: Job;

  @ManyToOne(() => Country, country => country.jobLocations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'countryId' })
  country: Country;
}

