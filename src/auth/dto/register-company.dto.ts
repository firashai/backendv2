import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsArray, IsUrl, IsNumber } from 'class-validator';

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

  @ApiProperty({ example: 1 })
  @IsNumber()
  countryId: number;

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

  // Removed requiredServices - now handled by junction tables
}
