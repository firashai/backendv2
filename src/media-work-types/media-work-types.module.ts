import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaWorkTypesService } from './media-work-types.service';
import { MediaWorkTypesController } from './media-work-types.controller';
import { MediaWorkType } from './entities/media-work-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MediaWorkType])],
  controllers: [MediaWorkTypesController],
  providers: [MediaWorkTypesService],
  exports: [MediaWorkTypesService],
})
export class MediaWorkTypesModule {}

