import { PartialType } from '@nestjs/swagger';
import { CreateRegisteredUserDto } from './create-registered-user.dto';

export class UpdateRegisteredUserDto extends PartialType(CreateRegisteredUserDto) {}
