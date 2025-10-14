import { IsString, IsNumber, IsOptional, IsArray, IsEnum, IsDate, IsBoolean, ValidateNested } from 'class-validator';
import { Type, Transform } from 'class-transformer';
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
  @IsString()
  salaryCurrency?: string;

  @IsOptional()
  @IsString()
  salaryPeriod?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => RequirementsDto)
  requirements?: RequirementsDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  benefits?: string[];

  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  @IsDate()
  applicationDeadline?: Date;

  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @IsString()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  // Contact info object
  @IsOptional()
  contactInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    preferredContact?: string;
  };

  // Additional job fields
  @IsOptional()
  @IsString()
  projectDetails?: string;

  @IsOptional()
  @IsBoolean()
  isUrgent?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

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
