import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../users/entities/user.entity';
import { Journalist } from '../journalists/entities/journalist.entity';
import { Company } from '../companies/entities/company.entity';
import { Job } from '../jobs/entities/job.entity';
import { MediaContent } from '../media-content/entities/media-content.entity';
import { JobApplication } from '../jobs/entities/job-application.entity';
import { MediaPurchase } from '../media-content/entities/media-purchase.entity';
import { Skill } from '../skills/entities/skill.entity';
import { Country } from '../countries/entities/country.entity';
import { Language } from '../languages/entities/language.entity';
import { AnalystSpecialty } from '../analyst-specialty/entities/analyst-specialty.entity';
import { MediaWorkType } from '../media-work-types/entities/media-work-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Journalist,
      Company,
      Job,
      MediaContent,
      JobApplication,
      MediaPurchase,
      Skill,
      Country,
      Language,
      AnalystSpecialty,
      MediaWorkType,
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}

