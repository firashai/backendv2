import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { RegisteredUser } from '../../registered-users/entities/registered-user.entity';
import { JobLocation } from '../../jobs/entities/job-location.entity';
import { CompanyLocation } from '../../companies/entities/company-location.entity';
import { MediaContentLocation } from '../../media-content/entities/media-content-location.entity';

@Entity('countries')
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ length: 3, unique: true })
  code: string;

  @Column({ length: 10, nullable: true })
  phoneCode: string;

  @Column({ length: 10, nullable: true })
  currency: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => User, user => user.country)
  users: User[];

  @OneToMany(() => RegisteredUser, registeredUser => registeredUser.country)
  registeredUsers: RegisteredUser[];

  @OneToMany(() => JobLocation, jobLocation => jobLocation.country)
  jobLocations: JobLocation[];

  @OneToMany(() => CompanyLocation, companyLocation => companyLocation.country)
  companyLocations: CompanyLocation[];

  @OneToMany(() => MediaContentLocation, mediaContentLocation => mediaContentLocation.country)
  mediaContentLocations: MediaContentLocation[];
}

