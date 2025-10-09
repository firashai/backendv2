import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { JournalistSkill } from '../../journalists/entities/journalist-skill.entity';
import { CompanyRequiredSkill } from '../../companies/entities/company-required-skill.entity';
import { JobRequiredSkill } from '../../jobs/entities/job-required-skill.entity';

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  category: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => JournalistSkill, journalistSkill => journalistSkill.skill)
  journalistSkills: JournalistSkill[];

  @OneToMany(() => CompanyRequiredSkill, companyRequiredSkill => companyRequiredSkill.skill)
  companyRequiredSkills: CompanyRequiredSkill[];

  @OneToMany(() => JobRequiredSkill, jobRequiredSkill => jobRequiredSkill.skill)
  jobRequiredSkills: JobRequiredSkill[];
}

