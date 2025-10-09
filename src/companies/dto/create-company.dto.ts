import { IsString, IsEmail, IsOptional, IsArray, IsNumber, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MediaWorkType, AnalystSpecialty } from '../../journalists/entities/journalist.entity';

class RequiredServiceDto {
  @IsString()
  serviceType: MediaWorkType;

  @IsOptional()
  @IsString()
  analystSpecialty?: AnalystSpecialty;

  @IsOptional()
  @IsString()
  description?: string;
}

class CompanySizeDto {
  @IsNumber()
  employees: number;

  @IsString()
  range: string;
}

class LocationDto {
  @IsString()
  country: string;

  @IsString()
  city: string;

  @IsString()
  address: string;
}

class SocialMediaAccountDto {
  @IsString()
  platform: string;

  @IsString()
  url: string;
}

export class CreateCompanyDto {
  @IsString()
  name: string;

  @IsString()
  contactName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  country: string;

  @IsString()
  city: string;

  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  website?: string;

  @ValidateNested()
  @Type(() => CompanySizeDto)
  companySize: CompanySizeDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  industry?: string[];

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  mission?: string;

  @IsOptional()
  @IsString()
  vision?: string;

  @ValidateNested({ each: true })
  @Type(() => RequiredServiceDto)
  @IsArray()
  requiredServices: RequiredServiceDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LocationDto)
  @IsArray()
  locations?: LocationDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SocialMediaAccountDto)
  @IsArray()
  socialMediaAccounts?: SocialMediaAccountDto[];

  @IsOptional()
  contactPersons?: any[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  paymentMethods?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredCommunication?: string[];
}
