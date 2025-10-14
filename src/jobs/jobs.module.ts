import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { Job } from './entities/job.entity';
import { JobApplication } from './entities/job-application.entity';
import { JobRequiredSkill } from './entities/job-required-skill.entity';
import { JobRequiredLanguage } from './entities/job-required-language.entity';
import { JobMediaWorkType } from './entities/job-media-work-type.entity';
import { JobLocation } from './entities/job-location.entity';
import { Journalist } from '../journalists/entities/journalist.entity';
import { Skill } from '../skills/entities/skill.entity';
import { Language } from '../languages/entities/language.entity';
import { MediaWorkType } from '../media-work-types/entities/media-work-type.entity';
import { Country } from '../countries/entities/country.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Job, 
      JobApplication, 
      JobRequiredSkill,
      JobRequiredLanguage,
      JobMediaWorkType,
      JobLocation,
      Journalist,
      Skill,
      Language,
      MediaWorkType,
      Country
    ])
  ],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
