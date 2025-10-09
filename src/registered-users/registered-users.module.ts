import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisteredUsersService } from './registered-users.service';
import { RegisteredUsersController } from './registered-users.controller';
import { RegisteredUser } from './entities/registered-user.entity';
import { User } from '../users/entities/user.entity';
import { Journalist } from '../journalists/entities/journalist.entity';
import { Company } from '../companies/entities/company.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RegisteredUser, User, Journalist, Company]),
  ],
  controllers: [RegisteredUsersController],
  providers: [RegisteredUsersService],
  exports: [RegisteredUsersService],
})
export class RegisteredUsersModule {}
