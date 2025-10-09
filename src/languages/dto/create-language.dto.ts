import { IsString, IsOptional, IsBoolean, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLanguageDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @Length(2, 5)
  code: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nativeName?: string;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

