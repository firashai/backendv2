import { IsString, IsEmail, IsOptional, IsArray, IsDate, IsBoolean, IsEnum } from 'class-validator';
import { MediaWorkType, AnalystSpecialty, SocialMediaPlatform } from '../entities/journalist.entity';

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

  @IsString()
  country: string;

  @IsString()
  cityOfResidence: string;

  @IsString()
  phoneNumber: string;

  @IsDate()
  dateOfBirth: Date;

  @IsDate()
  mediaWorkStartDate: Date;

  @IsEnum(MediaWorkType)
  mediaWorkType: MediaWorkType;

  @IsOptional()
  @IsEnum(AnalystSpecialty)
  analystSpecialty?: AnalystSpecialty;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

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
}
