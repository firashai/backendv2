import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { Job } from './entities/job.entity';
import { JobApplication } from './entities/job-application.entity';
import { Journalist } from '../journalists/entities/journalist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job, JobApplication, Journalist])],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
