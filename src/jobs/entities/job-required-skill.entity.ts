import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Job } from './job.entity';
import { Skill } from '../../skills/entities/skill.entity';

export enum ImportanceLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

@Entity('job_required_skills')
export class JobRequiredSkill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  jobId: number;

  @Column()
  skillId: number;

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
  @ManyToOne(() => Job, job => job.jobRequiredSkills, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'jobId' })
  job: Job;

  @ManyToOne(() => Skill, skill => skill.jobRequiredSkills, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'skillId' })
  skill: Skill;
}

