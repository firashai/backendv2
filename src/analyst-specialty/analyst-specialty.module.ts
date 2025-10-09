import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalystSpecialtyService } from './analyst-specialty.service';
import { AnalystSpecialtyController } from './analyst-specialty.controller';
import { AnalystSpecialty } from './entities/analyst-specialty.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AnalystSpecialty])],
  controllers: [AnalystSpecialtyController],
  providers: [AnalystSpecialtyService],
  exports: [AnalystSpecialtyService],
})
export class AnalystSpecialtyModule {}

