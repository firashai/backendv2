import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { MediaContentLocation } from './media-content-location.entity';

export enum MediaType {
  VIDEO = 'video',
  PHOTO = 'photo',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  FOOTAGE = 'footage',
}

export enum MediaStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  SOLD = 'sold',
  ARCHIVED = 'archived',
}

export enum LicenseType {
  EXCLUSIVE = 'exclusive',
  NON_EXCLUSIVE = 'non_exclusive',
  LIMITED_USE = 'limited_use',
  CUSTOM = 'custom',
}

@Entity('media_content')
export class MediaContent {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column({ type: 'text' })
  description: string;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: MediaType,
  })
  mediaType: MediaType;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: MediaStatus,
    default: MediaStatus.DRAFT,
  })
  status: MediaStatus;

  @ApiProperty()
  @Column()
  fileUrl: string;

  @ApiProperty()
  @Column({ nullable: true })
  thumbnailUrl: string;

  @ApiProperty()
  @Column({ nullable: true })
  previewUrl: string;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: LicenseType,
    default: LicenseType.NON_EXCLUSIVE,
  })
  licenseType: LicenseType;

  @ApiProperty()
  @Column({ type: 'json', nullable: true })
  tags: string[];

  @ApiProperty()
  @Column({ type: 'json', nullable: true })
  categories: string[];

  // Removed location column - now handled by junction table

  @ApiProperty()
  @Column({ type: 'date', nullable: true })
  recordedDate: Date;

  @ApiProperty()
  @Column({ nullable: true })
  duration: string;

  @ApiProperty()
  @Column({ nullable: true })
  resolution: string;

  @ApiProperty()
  @Column({ nullable: true })
  fileSize: string;

  @ApiProperty()
  @Column({ type: 'json', nullable: true })
  metadata: {
    camera?: string;
    settings?: string;
    location?: string;
    [key: string]: any;
  };

  @ApiProperty()
  @Column({ type: 'json', nullable: true })
  usageRights: {
    allowedUses: string[];
    restrictions: string[];
    attribution: boolean;
  };

  @ApiProperty()
  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @ApiProperty()
  @Column({ default: 0 })
  totalViews: number;

  @ApiProperty()
  @Column({ default: 0 })
  totalDownloads: number;

  @ApiProperty()
  @Column({ default: 0 })
  totalSales: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalRevenue: number;

  @ApiProperty()
  @Column({ type: 'json', nullable: true })
  reviews: {
    userId: number;
    rating: number;
    comment: string;
    date: Date;
  }[];

  @ApiProperty()
  @Column({ default: false })
  isFeatured: boolean;

  @ApiProperty()
  @Column({ default: false })
  isVerified: boolean;

  @ApiProperty()
  @Column({ default: false })
  isApproved: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  approvedBy: number;

  @ApiProperty()
  @Column({ nullable: true })
  approvedAt: Date;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  approvalNotes: string;

  @ApiProperty()
  @Column({ type: 'json', nullable: true })
  watermarks: {
    position: string;
    opacity: number;
    text: string;
  }[];

  @ApiProperty()
  @Column({ type: 'json', nullable: true })
  alternativeFormats: {
    format: string;
    url: string;
    price: number;
  }[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne('Journalist', 'mediaContent')
  @JoinColumn({ name: 'journalistId' })
  journalist: any;

  @ManyToOne('Company', 'mediaContent')
  @JoinColumn({ name: 'companyId' })
  company: any;

  @OneToMany('MediaPurchase', 'mediaContent')
  purchases: any[];

  @OneToMany(() => MediaContentLocation, mediaContentLocation => mediaContentLocation.mediaContent)
  mediaContentLocations: MediaContentLocation[];
}

// Import these entities to avoid circular dependency issues
import { Journalist } from '../../journalists/entities/journalist.entity';
import { MediaPurchase } from './media-purchase.entity';
