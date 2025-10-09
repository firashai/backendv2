import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { Company } from './entities/company.entity';
import { Job } from '../jobs/entities/job.entity';
import { JobApplication } from '../jobs/entities/job-application.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Job, JobApplication])],
  controllers: [CompaniesController],
  providers: [CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
