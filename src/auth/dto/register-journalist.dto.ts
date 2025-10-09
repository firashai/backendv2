import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsDateString, IsBoolean, IsOptional, IsEnum, IsArray } from 'class-validator';
import { MediaWorkType, AnalystSpecialty, SocialMediaPlatform } from '../../journalists/entities/journalist.entity';

export class RegisterJournalistDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'United States' })
  @IsString()
  country: string;

  @ApiProperty({ example: 'New York' })
  @IsString()
  cityOfResidence: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: '1990-01-01' })
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({ example: '2015-01-01' })
  @IsDateString()
  mediaWorkStartDate: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  hasCamera: boolean;

  @ApiProperty({ example: 'Canon EOS R5', required: false })
  @IsOptional()
  @IsString()
  cameraType?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  hasAudioEquipment: boolean;

  @ApiProperty({ example: 'Rode NTG5', required: false })
  @IsOptional()
  @IsString()
  audioEquipmentType?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  canTravel: boolean;

  @ApiProperty({ enum: MediaWorkType, example: MediaWorkType.VIDEO_PRODUCTION })
  @IsEnum(MediaWorkType)
  mediaWorkType: MediaWorkType;

  @ApiProperty({ enum: AnalystSpecialty, example: AnalystSpecialty.MIDDLE_EASTERN_AFFAIRS, required: false })
  @IsOptional()
  @IsEnum(AnalystSpecialty)
  analystSpecialty?: AnalystSpecialty;

  @ApiProperty({ 
    example: [
      { platform: SocialMediaPlatform.FACEBOOK, url: 'https://facebook.com/johndoe' },
      { platform: SocialMediaPlatform.TWITTER, url: 'https://twitter.com/johndoe' }
    ],
    required: false 
  })
  @IsOptional()
  @IsArray()
  socialMediaAccounts?: {
    platform: SocialMediaPlatform;
    url: string;
  }[];

  @ApiProperty({ 
    example: [
      'https://example.com/work1',
      'https://example.com/work2'
    ],
    required: false 
  })
  @IsOptional()
  @IsArray()
  previousWorkLinks?: string[];
}
