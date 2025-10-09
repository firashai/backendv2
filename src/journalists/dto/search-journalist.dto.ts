import { IsOptional, IsString, IsArray, IsBoolean, IsEnum, IsNumber } from 'class-validator';
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
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  offset?: number;
}
