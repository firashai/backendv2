import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum PurchaseStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  BANK_TRANSFER = 'bank_transfer',
  PAYPAL = 'paypal',
  CRYPTO = 'crypto',
}

@Entity('media_purchases')
export class MediaPurchase {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  transactionId: string;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  platformFee: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  sellerAmount: number;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: PurchaseStatus,
    default: PurchaseStatus.PENDING,
  })
  status: PurchaseStatus;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  paymentMethod: PaymentMethod;

  @ApiProperty()
  @Column({ nullable: true })
  paymentReference: string;

  @ApiProperty()
  @Column({ type: 'json', nullable: true })
  licenseDetails: {
    type: string;
    usage: string[];
    restrictions: string[];
    expirationDate?: Date;
  };

  @ApiProperty()
  @Column({ type: 'json', nullable: true })
  buyerInfo: {
    name: string;
    email: string;
    company?: string;
    usage: string;
  };

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  notes: string;

  @ApiProperty()
  @Column({ nullable: true })
  downloadUrl: string;

  @ApiProperty()
  @Column({ nullable: true })
  downloadExpiryDate: Date;

  @ApiProperty()
  @Column({ default: false })
  isDownloaded: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  downloadedAt: Date;

  @ApiProperty()
  @Column({ type: 'json', nullable: true })
  refundReason: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne('MediaContent', 'purchases')
  @JoinColumn()
  mediaContent: any;

  @ManyToOne('User', 'purchases')
  @JoinColumn()
  buyer: any;

  @ManyToOne('User', 'sales')
  @JoinColumn()
  seller: any;
}

// Import these entities to avoid circular dependency issues
import { MediaContent } from './media-content.entity';
import { User } from '../../users/entities/user.entity';
