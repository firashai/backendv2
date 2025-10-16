import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisteredUsersService } from './registered-users.service';
import { RegisteredUsersController } from './registered-users.controller';
import { RegisteredUser } from './entities/registered-user.entity';
import { User } from '../users/entities/user.entity';
import { Journalist } from '../journalists/entities/journalist.entity';
import { Company } from '../companies/entities/company.entity';
import { Skill } from '../skills/entities/skill.entity';
import { Language } from '../languages/entities/language.entity';
import { MediaWorkType } from '../media-work-types/entities/media-work-type.entity';
import { JournalistSkill } from '../journalists/entities/journalist-skill.entity';
import { JournalistLanguage } from '../journalists/entities/journalist-language.entity';
import { JournalistMediaWorkType } from '../journalists/entities/journalist-media-work-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RegisteredUser, 
      User, 
      Journalist, 
      Company,
      Skill,
      Language,
      MediaWorkType,
      JournalistSkill,
      JournalistLanguage,
      JournalistMediaWorkType
    ]),
  ],
  controllers: [RegisteredUsersController],
  providers: [RegisteredUsersService],
  exports: [RegisteredUsersService],
})
export class RegisteredUsersModule {}
