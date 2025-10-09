import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { MediaContent } from './media-content.entity';
import { Country } from '../../countries/entities/country.entity';

@Entity('media_content_locations')
export class MediaContentLocation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mediaContentId: number;

  @Column()
  countryId: number;

  @Column({ nullable: true })
  city: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => MediaContent, mediaContent => mediaContent.mediaContentLocations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'mediaContentId' })
  mediaContent: MediaContent;

  @ManyToOne(() => Country, country => country.mediaContentLocations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'countryId' })
  country: Country;
}

