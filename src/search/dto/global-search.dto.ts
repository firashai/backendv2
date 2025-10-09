import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum SearchType {
  ALL = 'all',
  JOURNALISTS = 'journalists',
  COMPANIES = 'companies',
  JOBS = 'jobs',
  MEDIA = 'media'
}

export class GlobalSearchDto {
  @IsString()
  query: string;

  @IsOptional()
  @IsEnum(SearchType)
  type?: SearchType;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  filters?: any;

  @IsOptional()
  limit?: number;

  @IsOptional()
  offset?: number;
}
