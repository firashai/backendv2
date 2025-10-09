import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Journalist } from './journalist.entity';
import { Language } from '../../languages/entities/language.entity';

export enum LanguageProficiencyLevel {
  BASIC = 'basic',
  INTERMEDIATE = 'intermediate',
  FLUENT = 'fluent',
  NATIVE = 'native'
}

@Entity('journalist_languages')
export class JournalistLanguage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  journalistId: number;

  @Column()
  languageId: number;

  @Column({
    type: 'enum',
    enum: LanguageProficiencyLevel,
    default: LanguageProficiencyLevel.INTERMEDIATE
  })
  proficiencyLevel: LanguageProficiencyLevel;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Journalist, journalist => journalist.journalistLanguages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'journalistId' })
  journalist: Journalist;

  @ManyToOne(() => Language, language => language.journalistLanguages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'languageId' })
  language: Language;
}

