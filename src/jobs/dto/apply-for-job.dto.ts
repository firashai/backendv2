import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class ApplyForJobDto {
  @IsOptional()
  @IsString()
  coverLetter?: string;

  @IsOptional()
  @IsString()
  resumeUrl?: string;

  @IsOptional()
  @IsString()
  resumeFilename?: string;

  @IsOptional()
  @IsNumber()
  resumeSize?: number;

  @IsOptional()
  @IsString()
  portfolio?: string;

  @IsOptional()
  @IsString()
  samples?: string;

  @IsOptional()
  @IsNumber()
  proposedRate?: number;

  @IsOptional()
  @IsString()
  proposedRateCurrency?: string;

  @IsOptional()
  @IsString()
  proposedRatePeriod?: string;

  @IsOptional()
  @IsDateString()
  availableStartDate?: string;

  @IsOptional()
  @IsString()
  availability?: string;

  @IsOptional()
  @IsString()
  answers?: string;

  @IsOptional()
  @IsString()
  references?: string;

  // Removed skills and languages - now handled by junction tables

  @IsOptional()
  @IsString()
  equipment?: string;

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @IsString()
  education?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  additionalInfo?: string;

  @IsOptional()
  @IsString()
  skills?: string;

  @IsOptional()
  @IsNumber()
  mediaWorkTypeId?: number;
}
