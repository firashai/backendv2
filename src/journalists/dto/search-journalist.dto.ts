import { IsOptional, IsString, IsArray, IsBoolean, IsEnum, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { MediaWorkType, AnalystSpecialty } from '../entities/journalist.entity';

export class SearchJournalistDto {
  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(MediaWorkType)
  mediaWorkType?: MediaWorkType;

  @IsOptional()
  @IsEnum(AnalystSpecialty)
  analystSpecialty?: AnalystSpecialty;

  @IsOptional()
  @IsBoolean()
  hasCamera?: boolean;

  @IsOptional()
  @IsBoolean()
  canTravel?: boolean;

  @IsOptional()
  @IsString()
  skill?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      // support comma-separated or single value
      return value.split(',').map(v => v.trim()).filter(Boolean);
    }
    // support query style skills[]
    if (value && typeof value === 'object' && '0' in value) {
      return Object.values(value as any);
    }
    return [];
  })
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      return value.split(',').map(v => v.trim()).filter(Boolean);
    }
    if (value && typeof value === 'object' && '0' in value) {
      return Object.values(value as any);
    }
    return [];
  })
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  limit?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  offset?: number;
}
