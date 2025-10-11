import { IsString, IsEmail, IsOptional, IsArray, IsDate, IsBoolean, IsEnum, IsNumber } from 'class-validator';
import { SocialMediaPlatform } from '../entities/journalist.entity';

class SocialMediaDto {
  @IsOptional()
  @IsString()
  facebook?: string;

  @IsOptional()
  @IsString()
  twitter?: string;

  @IsOptional()
  @IsString()
  youtube?: string;

  @IsOptional()
  @IsString()
  other?: string;
}

export class CreateJournalistDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsNumber()
  countryId: number;

  @IsString()
  cityOfResidence: string;

  @IsString()
  phoneNumber: string;

  @IsDate()
  dateOfBirth: Date;

  @IsDate()
  mediaWorkStartDate: Date;

  // Removed mediaWorkType and analystSpecialty - now handled by junction tables

  @IsOptional()
  @IsString()
  bio?: string;

  // Removed skills and languages - now handled by junction tables

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  previousWorkLinks?: string[];

  @IsOptional()
  socialMedia?: SocialMediaDto;

  @IsOptional()
  @IsBoolean()
  hasCamera?: boolean;

  @IsOptional()
  @IsString()
  cameraType?: string;

  @IsOptional()
  @IsBoolean()
  hasAudioEquipment?: boolean;

  @IsOptional()
  @IsString()
  audioEquipmentType?: string;

  @IsOptional()
  @IsBoolean()
  canTravel?: boolean;

  @IsOptional()
  @IsNumber()
  totalClients?: number;

  @IsOptional()
  @IsNumber()
  yearsExperience?: number;

  @IsOptional()
  @IsNumber()
  totalProjects?: number;
}
