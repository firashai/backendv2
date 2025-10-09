import { PartialType } from '@nestjs/swagger';
import { CreateMediaWorkTypeDto } from './create-media-work-type.dto';

export class UpdateMediaWorkTypeDto extends PartialType(CreateMediaWorkTypeDto) {}

