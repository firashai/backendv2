import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

import { MediaContent, MediaStatus, MediaType } from './entities/media-content.entity';
import { MediaPurchase, PurchaseStatus } from './entities/media-purchase.entity';
import { CreateMediaContentDto } from './dto/create-media-content.dto';
import { UpdateMediaContentDto } from './dto/update-media-content.dto';
import { PurchaseMediaContentDto } from './dto/purchase-media-content.dto';

@Injectable()
export class MediaContentService {
  constructor(
    @InjectRepository(MediaContent)
    private readonly mediaContentRepository: Repository<MediaContent>,
    @InjectRepository(MediaPurchase)
    private readonly mediaPurchaseRepository: Repository<MediaPurchase>,
    private readonly configService: ConfigService,
  ) {}

  // Generate thumbnail for uploaded files
  private async generateThumbnail(file: Express.Multer.File): Promise<string | null> {
    try {
      const filePath = file.path;
      const fileExtension = path.extname(file.originalname).toLowerCase();
      
      // For images, we can use the original file as thumbnail
      if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(fileExtension)) {
        const uploadPath = this.configService.get<string>('UPLOAD_PATH', 'uploads');
        return `/${uploadPath}/${file.filename}`;
      }
      
      // For videos, we would need to extract a frame (requires ffmpeg)
      // For now, we'll return null and use placeholder icons
      if (['.mp4', '.avi', '.mov', '.wmv'].includes(fileExtension)) {
        // TODO: Implement video thumbnail extraction with ffmpeg
        return null;
      }
      
      // For audio files, we'll use a placeholder
      if (['.mp3', '.wav', '.mpeg'].includes(fileExtension)) {
        return null;
      }
      
      // For documents, we'll use a placeholder
      if (['.pdf', '.doc', '.docx'].includes(fileExtension)) {
        return null;
      }
      
      return null;
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      return null;
    }
  }

  // Generate thumbnail from existing file URL
  private async generateThumbnailFromUrl(fileUrl: string): Promise<string | null> {
    try {
      if (!fileUrl) return null;
      
      const fileExtension = path.extname(fileUrl).toLowerCase();
      
      // For images, we can use the original file as thumbnail
      if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(fileExtension)) {
        return fileUrl;
      }
      
      // For other file types, return null (use placeholder icons)
      return null;
    } catch (error) {
      console.error('Error generating thumbnail from URL:', error);
      return null;
    }
  }

  async create(createMediaContentDto: CreateMediaContentDto, file?: Express.Multer.File, user?: any): Promise<MediaContent> {
    // Handle file upload
    if (file) {
      // In a real application, you would upload the file to cloud storage
      // and get back a URL. For now, we'll use a placeholder
      const uploadPath = this.configService.get<string>('UPLOAD_PATH', 'uploads');
      createMediaContentDto.fileUrl = `/${uploadPath}/${file.filename}`;
    } else if (!createMediaContentDto.fileUrl) {
      throw new BadRequestException('Either a file must be uploaded or a fileUrl must be provided');
    }

    const mediaContent = this.mediaContentRepository.create({
      ...createMediaContentDto,
      status: MediaStatus.PUBLISHED
    });
    return this.mediaContentRepository.save(mediaContent);
  }

  async createMyContent(createMediaContentDto: CreateMediaContentDto, file?: Express.Multer.File, user?: any): Promise<MediaContent> {

    
    // Handle file upload
    if (file) {
      console.log('File upload details:', {
        originalname: file.originalname,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path
      });
      
      // Use the actual filename that was saved to disk
      if (file.filename) {
        const uploadPath = this.configService.get<string>('UPLOAD_PATH', 'uploads');
        createMediaContentDto.fileUrl = `/${uploadPath}/${file.filename}`;
        console.log('Set fileUrl to:', createMediaContentDto.fileUrl);
        
        // Generate thumbnail
        const thumbnailUrl = await this.generateThumbnail(file);
        if (thumbnailUrl) {
          createMediaContentDto.thumbnailUrl = thumbnailUrl;
          console.log('Set thumbnailUrl to:', createMediaContentDto.thumbnailUrl);
        }
      } else {
        throw new BadRequestException('File upload failed - no filename generated');
      }
    } else if (!createMediaContentDto.fileUrl) {
      throw new BadRequestException('Either a file must be uploaded or a fileUrl must be provided');
    }

    // Set initial status as DRAFT for admin approval
    const mediaContent = this.mediaContentRepository.create({
      ...createMediaContentDto,
      status: MediaStatus.DRAFT,
      isApproved: false,
      isVerified: false
    });

    // Associate with the user based on their role
    if (user.role === 'journalist') {
      mediaContent.journalist = { id: user.profile?.id };
      mediaContent.company = null;
    } else if (user.role === 'company') {
      mediaContent.company = { id: user.profile?.id };
      mediaContent.journalist = null;
    } else if (user.role === 'registered_user') {
      // For registered users, we can associate with their profile or leave unassociated
      // This allows registered users to upload media for sale
      mediaContent.journalist = null;
      mediaContent.company = null;
    }

    return this.mediaContentRepository.save(mediaContent);
  }

  async findAll(query?: any): Promise<MediaContent[]> {
    const mediaContent = await this.mediaContentRepository.find({
      relations: ['journalist'],
      where: { status: MediaStatus.PUBLISHED },
      order: { createdAt: 'DESC' },
    });

    // Generate thumbnails for media that don't have them
    for (const media of mediaContent) {
      if (!media.thumbnailUrl && media.fileUrl) {
        const thumbnailUrl = await this.generateThumbnailFromUrl(media.fileUrl);
        if (thumbnailUrl && thumbnailUrl !== media.thumbnailUrl) {
          media.thumbnailUrl = thumbnailUrl;
          await this.mediaContentRepository.save(media);
          console.log(`Generated thumbnail for media ${media.id}:`, thumbnailUrl);
        }
      }
    }

    return mediaContent;
  }

  async findOne(id: number): Promise<MediaContent> {
    const mediaContent = await this.mediaContentRepository.findOne({
      where: { id },
      relations: ['journalist', 'purchases'],
    });

    if (!mediaContent) {
      throw new NotFoundException(`Media content with ID ${id} not found`);
    }

    return mediaContent;
  }

  async findByJournalist(journalistId: number): Promise<MediaContent[]> {
    return this.mediaContentRepository.find({
      where: { journalist: { id: journalistId } },
      relations: ['journalist'],
      order: { createdAt: 'DESC' },
    });
  }

  async findMyContent(user: any): Promise<MediaContent[]> {
    let whereCondition: any = {};

    if (user.role === 'journalist') {
      whereCondition.journalist = { id: user.profile?.id };
    } else if (user.role === 'company') {
      whereCondition.company = { id: user.profile?.id };
    }

    const mediaContent = await this.mediaContentRepository.find({
      where: whereCondition,
      relations: ['journalist', 'company'],
      order: { createdAt: 'DESC' },
    });

    // Generate thumbnails for media that don't have them
    for (const media of mediaContent) {
      if (!media.thumbnailUrl && media.fileUrl) {
        const thumbnailUrl = await this.generateThumbnailFromUrl(media.fileUrl);
        if (thumbnailUrl && thumbnailUrl !== media.thumbnailUrl) {
          media.thumbnailUrl = thumbnailUrl;
          await this.mediaContentRepository.save(media);
          console.log(`Generated thumbnail for media ${media.id}:`, thumbnailUrl);
        }
      }
    }

    return mediaContent;
  }

  async update(id: number, updateMediaContentDto: UpdateMediaContentDto, user?: any): Promise<MediaContent> {
    const mediaContent = await this.findOne(id);
    Object.assign(mediaContent, updateMediaContentDto);
    return this.mediaContentRepository.save(mediaContent);
  }

  async updateMyContent(id: number, updateMediaContentDto: UpdateMediaContentDto, file?: Express.Multer.File, user?: any): Promise<MediaContent> {
    const mediaContent = await this.findOne(id);
    
    console.log('Updating media content:', id);
    console.log('Current media content:', mediaContent);
    console.log('Update DTO:', updateMediaContentDto);
    console.log('File:', file);
    
    // Check ownership
    if (user.role === 'journalist' && mediaContent.journalist?.id !== user.profile?.id) {
      throw new ForbiddenException('You can only update your own media content');
    }
    if (user.role === 'company' && mediaContent.company?.id !== user.profile?.id) {
      throw new ForbiddenException('You can only update your own media content');
    }
    
    // Handle file upload if a new file is provided
    if (file) {
      console.log('File upload details for update:', {
        originalname: file.originalname,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path
      });
      
      // Use the actual filename that was saved to disk
      if (file.filename) {
        const uploadPath = this.configService.get<string>('UPLOAD_PATH', 'uploads');
        updateMediaContentDto.fileUrl = `/${uploadPath}/${file.filename}`;
        console.log('Set fileUrl to:', updateMediaContentDto.fileUrl);
        
        // Generate thumbnail for new file
        const thumbnailUrl = await this.generateThumbnail(file);
        if (thumbnailUrl) {
          updateMediaContentDto.thumbnailUrl = thumbnailUrl;
          console.log('Set thumbnailUrl to:', updateMediaContentDto.thumbnailUrl);
        }
      } else {
        throw new BadRequestException('File upload failed - no filename generated');
      }
    }
    
    // Reset approval status when content is updated
    updateMediaContentDto.isApproved = false;
    updateMediaContentDto.status = MediaStatus.DRAFT;
    
    // Preserve existing data if not provided in update
    if (!updateMediaContentDto.usageRights && mediaContent.usageRights) {
      updateMediaContentDto.usageRights = mediaContent.usageRights;
    }
    
    if (!updateMediaContentDto.fileUrl && mediaContent.fileUrl) {
      updateMediaContentDto.fileUrl = mediaContent.fileUrl;
    }
    
    if (!updateMediaContentDto.thumbnailUrl && mediaContent.thumbnailUrl) {
      updateMediaContentDto.thumbnailUrl = mediaContent.thumbnailUrl;
    }
    
    console.log('Final update DTO:', updateMediaContentDto);
    
    Object.assign(mediaContent, updateMediaContentDto);
    const savedContent = await this.mediaContentRepository.save(mediaContent);
    
    console.log('Saved media content:', savedContent);
    return savedContent;
  }

  async remove(id: number, user?: any): Promise<void> {
    const mediaContent = await this.findOne(id);
    await this.mediaContentRepository.remove(mediaContent);
  }

  async removeMyContent(id: number, user: any): Promise<void> {
    const mediaContent = await this.findOne(id);
    
    // Check ownership
    if (user.role === 'journalist' && mediaContent.journalist?.id !== user.profile?.id) {
      throw new ForbiddenException('You can only delete your own media content');
    }
    if (user.role === 'company' && mediaContent.company?.id !== user.profile?.id) {
      throw new ForbiddenException('You can only delete your own media content');
    }
    
    await this.mediaContentRepository.remove(mediaContent);
  }

  async purchase(id: number, purchaseDto: PurchaseMediaContentDto, user?: any): Promise<MediaPurchase> {
    const { mediaContentId, buyerId, paymentMethod, transactionId, notes } = purchaseDto;

    const mediaContent = await this.findOne(+mediaContentId);
    
    if (mediaContent.status !== MediaStatus.PUBLISHED) {
      throw new BadRequestException('Media content is not available for purchase');
    }

    // Calculate platform fee (e.g., 10%)
    const platformFee = mediaContent.price * 0.1;
    const sellerAmount = mediaContent.price - platformFee;

    // Generate transaction ID if not provided
    const finalTransactionId = transactionId || `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const purchase = this.mediaPurchaseRepository.create({
      transactionId: finalTransactionId,
      amount: mediaContent.price,
      platformFee,
      sellerAmount,
      paymentMethod,
      mediaContent,
      buyer: { id: +buyerId },
      seller: { id: mediaContent.journalist.user.id },
      status: PurchaseStatus.COMPLETED,
    });

    const savedPurchase = await this.mediaPurchaseRepository.save(purchase);

    // Update media content stats
    mediaContent.totalSales += 1;
    mediaContent.totalRevenue += sellerAmount;
    await this.mediaContentRepository.save(mediaContent);

    return savedPurchase;
  }

  async getFeaturedContent(): Promise<MediaContent[]> {
    const mediaContent = await this.mediaContentRepository.find({
      relations: ['journalist'],
      where: { isFeatured: true, status: MediaStatus.PUBLISHED },
      order: { rating: 'DESC' },
      take: 10,
    });

    // Generate thumbnails for media that don't have them
    for (const media of mediaContent) {
      if (!media.thumbnailUrl && media.fileUrl) {
        const thumbnailUrl = await this.generateThumbnailFromUrl(media.fileUrl);
        if (thumbnailUrl && thumbnailUrl !== media.thumbnailUrl) {
          media.thumbnailUrl = thumbnailUrl;
          await this.mediaContentRepository.save(media);
          console.log(`Generated thumbnail for featured media ${media.id}:`, thumbnailUrl);
        }
      }
    }

    return mediaContent;
  }

  async findFeatured(): Promise<MediaContent[]> {
    return this.getFeaturedContent();
  }

  async search(query: any): Promise<MediaContent[]> {
    const mediaContent = await this.mediaContentRepository.find({
      relations: ['journalist'],
      where: { status: MediaStatus.PUBLISHED },
      order: { rating: 'DESC' },
    });

    // Generate thumbnails for media that don't have them
    for (const media of mediaContent) {
      if (!media.thumbnailUrl && media.fileUrl) {
        const thumbnailUrl = await this.generateThumbnailFromUrl(media.fileUrl);
        if (thumbnailUrl && thumbnailUrl !== media.thumbnailUrl) {
          media.thumbnailUrl = thumbnailUrl;
          await this.mediaContentRepository.save(media);
          console.log(`Generated thumbnail for search media ${media.id}:`, thumbnailUrl);
        }
      }
    }

    return mediaContent;
  }

  async searchByType(mediaType: MediaType): Promise<MediaContent[]> {
    const mediaContent = await this.mediaContentRepository.find({
      relations: ['journalist'],
      where: { mediaType, status: MediaStatus.PUBLISHED },
      order: { rating: 'DESC' },
    });

    // Generate thumbnails for media that don't have them
    for (const media of mediaContent) {
      if (!media.thumbnailUrl && media.fileUrl) {
        const thumbnailUrl = await this.generateThumbnailFromUrl(media.fileUrl);
        if (thumbnailUrl && thumbnailUrl !== media.thumbnailUrl) {
          media.thumbnailUrl = thumbnailUrl;
          await this.mediaContentRepository.save(media);
          console.log(`Generated thumbnail for type search media ${media.id}:`, thumbnailUrl);
        }
      }
    }

    return mediaContent;
  }

  async searchByPriceRange(minPrice: number, maxPrice: number): Promise<MediaContent[]> {
    const mediaContent = await this.mediaContentRepository.find({
      relations: ['journalist'],
      where: { 
        price: Between(minPrice, maxPrice),
        status: MediaStatus.PUBLISHED,
      },
      order: { price: 'ASC' },
    });

    // Generate thumbnails for media that don't have them
    for (const media of mediaContent) {
      if (!media.thumbnailUrl && media.fileUrl) {
        const thumbnailUrl = await this.generateThumbnailFromUrl(media.fileUrl);
        if (thumbnailUrl && thumbnailUrl !== media.thumbnailUrl) {
          media.thumbnailUrl = thumbnailUrl;
          await this.mediaContentRepository.save(media);
          console.log(`Generated thumbnail for price range search media ${media.id}:`, thumbnailUrl);
        }
      }
    }

    return mediaContent;
  }

  async incrementViews(id: number): Promise<void> {
    await this.mediaContentRepository.increment({ id }, 'totalViews', 1);
  }

  async updateRating(id: number, newRating: number): Promise<MediaContent> {
    const mediaContent = await this.findOne(id);
    
    const totalRating = mediaContent.rating * mediaContent.reviews.length + newRating;
    mediaContent.reviews.push({
      userId: 0, // TODO: Get from request
      rating: newRating,
      comment: '',
      date: new Date(),
    });
    mediaContent.rating = totalRating / mediaContent.reviews.length;

    return this.mediaContentRepository.save(mediaContent);
  }
}
