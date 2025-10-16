import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsObject, IsNumber, IsBoolean, IsArray } from 'class-validator';

export enum UpgradeType {
  JOURNALIST = 'journalist',
  COMPANY = 'company',
}

export class UpgradeProfileDto {
  @ApiProperty({ enum: UpgradeType })
  @IsEnum(UpgradeType)
  upgradeType: UpgradeType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  countryId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };

  // Journalist-specific fields
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  cityOfResidence?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  specialization?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  experience?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  languages?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  portfolio?: string;

  // Equipment and capabilities
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hasCamera?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  cameraType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hasAudioEquipment?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  audioEquipmentType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  canTravel?: boolean;

  // Rates
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  hourlyRate?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  dailyRate?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  projectRate?: number;

  // Performance metrics
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  totalProjects?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  totalClients?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  yearsExperience?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  onTimeRate?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  onBudgetRate?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  acceptRate?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  repeatHireRate?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  jobSuccessRate?: number;

  // Skills, languages, and media work types
  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mediaWorkTypes?: string[];

  // Company-specific fields
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  companySize?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
