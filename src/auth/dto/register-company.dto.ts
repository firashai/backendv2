import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsArray, IsUrl } from 'class-validator';
import { MediaWorkType, AnalystSpecialty } from '../../journalists/entities/journalist.entity';

export class RegisterCompanyDto {
  @ApiProperty({ example: 'company@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'ABC Media Company' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'United States' })
  @IsString()
  country: string;

  @ApiProperty({ example: 'New York' })
  @IsString()
  city: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: 'https://www.abccompany.com', required: false })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({ 
    example: [
      { serviceType: MediaWorkType.VIDEO_PRODUCTION },
      { serviceType: MediaWorkType.PHOTO_JOURNALISM }
    ],
    required: false 
  })
  @IsOptional()
  @IsArray()
  requiredServices?: {
    serviceType: MediaWorkType;
    analystSpecialty?: AnalystSpecialty;
    description?: string;
  }[];
}
