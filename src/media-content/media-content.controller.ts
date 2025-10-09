import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { MediaContentService } from './media-content.service';
import { CreateMediaContentDto } from './dto/create-media-content.dto';
import { UpdateMediaContentDto } from './dto/update-media-content.dto';
import { PurchaseMediaContentDto } from './dto/purchase-media-content.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MediaContentTransformInterceptor } from './interceptors/media-content-transform.interceptor';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('media-content')
export class MediaContentController {
  constructor(
    private readonly mediaContentService: MediaContentService,
    private readonly configService: ConfigService
  ) {}

  // Get upload path from environment
  private getUploadPath(): string {
    return this.configService.get<string>('UPLOAD_PATH', 'uploads');
  }

  // File upload configuration
  private static getFileUploadConfig(uploadPath: string = 'uploads') {
    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          let uploadsDir = uploadPath;
          const fs = require('fs');
          const path = require('path');
          // If the path is not absolute, make it relative to process.cwd()
          if (!path.isAbsolute(uploadPath)) {
            uploadsDir = path.join(process.cwd(), uploadPath);
          }
  
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }
  
          cb(null, uploadsDir);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const extension = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
        }
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
          'image/jpeg', 'image/png', 'image/gif', 'image/webp',
          'video/mp4', 'video/avi', 'video/mov', 'video/wmv',
          'audio/mpeg', 'audio/wav', 'audio/mp3',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Invalid file type'), false);
        }
      },
      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB
      }
    };
  }
  
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file', MediaContentController.getFileUploadConfig(process.env.UPLOAD_PATH || 'uploads')), MediaContentTransformInterceptor)
  create(@Body() createMediaContentDto: CreateMediaContentDto, @UploadedFile() file: Express.Multer.File, @Request() req) {
    return this.mediaContentService.create(createMediaContentDto, file, req.user);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.mediaContentService.findAll(query);
  }

  @Get('featured')
  findFeatured() {
    return this.mediaContentService.findFeatured();
  }

  @Get('search')
  search(@Query() query: any) {
    return this.mediaContentService.search(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mediaContentService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(MediaContentTransformInterceptor)
  update(@Param('id') id: string, @Body() updateMediaContentDto: UpdateMediaContentDto, @Request() req) {
    return this.mediaContentService.update(+id, updateMediaContentDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.mediaContentService.remove(+id, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/purchase')
  purchase(@Param('id') id: string, @Body() purchaseDto: PurchaseMediaContentDto, @Request() req) {
    return this.mediaContentService.purchase(+id, purchaseDto, req.user);
  }

  // User-specific media endpoints
  @UseGuards(JwtAuthGuard)
  @Get('my/content')
  findMyContent(@Request() req) {
    return this.mediaContentService.findMyContent(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('my/upload')
  @UseInterceptors(FileInterceptor('file', MediaContentController.getFileUploadConfig(process.env.UPLOAD_PATH || 'uploads')), MediaContentTransformInterceptor)
  async uploadMyContent(@Body() createMediaContentDto: CreateMediaContentDto, @UploadedFile() file: Express.Multer.File, @Request() req) {
    try {
      console.log('Upload request received:', { file: file?.filename, dto: createMediaContentDto });
      const result = await this.mediaContentService.createMyContent(createMediaContentDto, file, req.user);
      console.log('Upload successful:', result);
      return result;
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('my/:id')
  @UseInterceptors(FileInterceptor('file', MediaContentController.getFileUploadConfig(process.env.UPLOAD_PATH || 'uploads')), MediaContentTransformInterceptor)
  async updateMyContent(@Param('id') id: string, @Body() updateMediaContentDto: UpdateMediaContentDto, @UploadedFile() file: Express.Multer.File, @Request() req) {
    try {
      console.log('Update request received:', { id, file: file?.filename, dto: updateMediaContentDto });
      const result = await this.mediaContentService.updateMyContent(+id, updateMediaContentDto, file, req.user);
      console.log('Update successful:', result);
      return result;
    } catch (error) {
      console.error('Update failed:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('my/:id')
  removeMyContent(@Param('id') id: string, @Request() req) {
    return this.mediaContentService.removeMyContent(+id, req.user);
  }
}
