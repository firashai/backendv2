import { PartialType } from '@nestjs/mapped-types';
import { CreateMediaContentDto } from './create-media-content.dto';

export class UpdateMediaContentDto extends PartialType(CreateMediaContentDto) {}
