import { IsString, IsNumber, IsOptional, IsEnum, IsBoolean, IsArray, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { MediaType, MediaStatus, LicenseType } from '../entities/media-content.entity';

export class UsageRightsDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowedUses?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  restrictions?: string[];

  @IsOptional()
  @IsBoolean()
  attribution?: boolean;
}

export class CreateMediaContentDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(MediaType)
  mediaType: MediaType;

  @IsOptional()
  @IsEnum(MediaStatus)
  status?: MediaStatus;

  @IsOptional()
  @IsString()
  fileUrl?: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @IsString()
  previewUrl?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(999999.99)
  price: number;

  @IsEnum(LicenseType)
  licenseType: LicenseType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsString()
  resolution?: string;

  @IsOptional()
  @IsString()
  fileSize?: string;

  @IsOptional()
  @IsBoolean()
  isExclusive?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => UsageRightsDto)
  usageRights?: UsageRightsDto;
}
