import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { JournalistAnalystSpecialty } from '../../journalists/entities/journalist-analyst-specialty.entity';
import { JobApplication } from '../../jobs/entities/job-application.entity';

@Entity('analyst_specialty')
export class AnalystSpecialty {
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
  @OneToMany(() => JournalistAnalystSpecialty, journalistAnalystSpecialty => journalistAnalystSpecialty.analystSpecialty)
  journalistAnalystSpecialties: JournalistAnalystSpecialty[];

  @OneToMany(() => JobApplication, jobApplication => jobApplication.analystSpecialty)
  jobApplications: JobApplication[];
}

