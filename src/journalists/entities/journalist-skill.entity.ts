import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Journalist } from './journalist.entity';
import { Skill } from '../../skills/entities/skill.entity';

export enum ProficiencyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

@Entity('journalist_skills')
export class JournalistSkill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  journalistId: number;

  @Column()
  skillId: number;

  @Column({
    type: 'enum',
    enum: ProficiencyLevel,
    default: ProficiencyLevel.INTERMEDIATE
  })
  proficiencyLevel: ProficiencyLevel;

  @Column({ nullable: true })
  yearsOfExperience: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Journalist, journalist => journalist.journalistSkills, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'journalistId' })
  journalist: Journalist;

  @ManyToOne(() => Skill, skill => skill.journalistSkills, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'skillId' })
  skill: Skill;
}

