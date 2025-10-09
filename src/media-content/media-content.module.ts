import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MediaContentService } from './media-content.service';
import { MediaContentController } from './media-content.controller';
import { MediaContent } from './entities/media-content.entity';
import { MediaPurchase } from './entities/media-purchase.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MediaContent, MediaPurchase])],
  controllers: [MediaContentController],
  providers: [MediaContentService],
  exports: [MediaContentService],
})
export class MediaContentModule {}
