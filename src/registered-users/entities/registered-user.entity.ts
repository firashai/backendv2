import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Country } from '../../countries/entities/country.entity';

@Entity('registered_users')
export class RegisteredUser {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  firstName: string;

  @ApiProperty()
  @Column()
  lastName: string;

  @ApiProperty()
  @Column({ nullable: true })
  bio: string;

  @ApiProperty()
  @Column({ nullable: true })
  phoneNumber: string;

  @ApiProperty()
  @Column({ nullable: true })
  countryId: number;

  @ApiProperty()
  @Column({ nullable: true })
  city: string;

  @ApiProperty()
  @Column({ nullable: true })
  profilePicture: string;

  @ApiProperty()
  @Column({ nullable: true })
  website: string;

  @ApiProperty()
  @Column({ type: 'json', nullable: true })
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };

  @ApiProperty()
  @Column({ type: 'json', nullable: true })
  skills: string[];

  @ApiProperty()
  @Column({ type: 'json', nullable: true })
  interests: string[];

  @ApiProperty()
  @Column({ default: 0 })
  totalMediaUploads: number;

  @ApiProperty()
  @Column({ default: 0 })
  totalMediaViews: number;

  @ApiProperty()
  @Column({ default: 0 })
  totalMediaSales: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalEarnings: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Country, country => country.registeredUsers)
  @JoinColumn({ name: 'countryId' })
  country: Country;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
