import { IsString, IsNumber, IsOptional, IsArray, IsEnum, IsDate, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { JobType, ExperienceLevel } from '../entities/job.entity';

class RequirementsDto {
  @IsBoolean()
  hasCamera: boolean;

  @IsOptional()
  @IsString()
  cameraType?: string;

  @IsBoolean()
  hasAudioEquipment: boolean;

  @IsOptional()
  @IsString()
  audioEquipmentType?: string;

  @IsBoolean()
  canTravel: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certifications?: string[];

  @IsOptional()
  @IsBoolean()
  portfolio?: boolean;
}

export class CreateJobDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(JobType)
  jobType: JobType;

  // Removed mediaWorkType and analystSpecialty - now handled by junction tables

  @IsEnum(ExperienceLevel)
  experienceLevel: ExperienceLevel;

  // Removed requiredSkills, preferredSkills, requiredLanguages, preferredLanguages - now handled by junction tables

  @IsOptional()
  @IsNumber()
  salaryMin?: number;

  @IsOptional()
  @IsNumber()
  salaryMax?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => RequirementsDto)
  requirements?: RequirementsDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  benefits?: string[];

  @IsOptional()
  @IsDate()
  applicationDeadline?: Date;

  @IsOptional()
  @IsString()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  // Junction table fields
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredSkills?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredLanguages?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mediaWorkTypes?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  locations?: string[];
}
