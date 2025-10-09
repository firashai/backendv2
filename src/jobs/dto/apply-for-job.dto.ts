import { IsString, IsOptional, IsNumber, IsDate } from 'class-validator';

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
  @IsDate()
  availableStartDate?: Date;

  @IsOptional()
  @IsString()
  availability?: string;

  @IsOptional()
  @IsString()
  answers?: string;

  @IsOptional()
  @IsString()
  references?: string;

  @IsOptional()
  @IsString()
  skills?: string;

  @IsOptional()
  @IsString()
  languages?: string;

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
}
