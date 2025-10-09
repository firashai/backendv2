import { IsOptional, IsString, IsArray, IsBoolean, IsEnum, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { JobType } from '../entities/job.entity';

export class SearchJobDto {
  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(JobType)
  jobType?: JobType;

  @IsOptional()
  @IsString()
  mediaWorkType?: string;

  @IsOptional()
  @IsString()
  analystSpecialty?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
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
