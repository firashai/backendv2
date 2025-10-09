import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Journalist } from './journalist.entity';
import { AnalystSpecialty } from '../../analyst-specialty/entities/analyst-specialty.entity';

@Entity('journalist_analyst_specialty')
export class JournalistAnalystSpecialty {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  journalistId: number;

  @Column()
  analystSpecialtyId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Journalist, journalist => journalist.journalistAnalystSpecialties, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'journalistId' })
  journalist: Journalist;

  @ManyToOne(() => AnalystSpecialty, analystSpecialty => analystSpecialty.journalistAnalystSpecialties, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'analystSpecialtyId' })
  analystSpecialty: AnalystSpecialty;
}

