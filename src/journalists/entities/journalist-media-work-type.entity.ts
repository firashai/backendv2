import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Journalist } from './journalist.entity';
import { MediaWorkType } from '../../media-work-types/entities/media-work-type.entity';

@Entity('journalist_media_work_types')
export class JournalistMediaWorkType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  journalistId: number;

  @Column()
  mediaWorkTypeId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Journalist, journalist => journalist.journalistMediaWorkTypes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'journalistId' })
  journalist: Journalist;

  @ManyToOne(() => MediaWorkType, mediaWorkType => mediaWorkType.journalistMediaWorkTypes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'mediaWorkTypeId' })
  mediaWorkType: MediaWorkType;
}

