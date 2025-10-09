import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JournalistsService } from './journalists.service';
import { JournalistsController } from './journalists.controller';
import { Journalist } from './entities/journalist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Journalist])],
  controllers: [JournalistsController],
  providers: [JournalistsService],
  exports: [JournalistsService],
})
export class JournalistsModule {}
