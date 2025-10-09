import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { Journalist } from '../journalists/entities/journalist.entity';
import { Job } from '../jobs/entities/job.entity';
import { MediaContent } from '../media-content/entities/media-content.entity';
import { Company } from '../companies/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Journalist, Job, MediaContent, Company])],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
