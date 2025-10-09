import { PartialType } from '@nestjs/swagger';
import { CreateAnalystSpecialtyDto } from './create-analyst-specialty.dto';

export class UpdateAnalystSpecialtyDto extends PartialType(CreateAnalystSpecialtyDto) {}

