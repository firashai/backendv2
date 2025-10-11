import { Controller, Get, Put, Post, Delete, Body, Param, UseGuards, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { Journalist } from '../journalists/entities/journalist.entity';
import { Company } from '../companies/entities/company.entity';
import { RegisteredUser } from '../registered-users/entities/registered-user.entity';

@ApiTags('Profile Management')
@Controller('auth/profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProfileController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  async getProfile(@Request() req) {
    return this.authService.getUserProfile(req.user.id);
  }

  @Put()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfile(@Request() req, @Body() profileData: any) {
    return this.authService.updateUserProfile(req.user.id, profileData);
  }

  @Post('picture')
  @UseInterceptors(FileInterceptor('profilePicture'))
  @ApiOperation({ summary: 'Upload profile picture' })
  @ApiResponse({ status: 200, description: 'Profile picture uploaded successfully' })
  async uploadProfilePicture(@Request() req, @UploadedFile() file: Express.Multer.File) {
    return this.authService.uploadProfilePicture(req.user.id, file);
  }

  @Post('cover')
  @UseInterceptors(FileInterceptor('coverPhoto'))
  @ApiOperation({ summary: 'Upload cover photo' })
  @ApiResponse({ status: 200, description: 'Cover photo uploaded successfully' })
  async uploadCoverPhoto(@Request() req, @UploadedFile() file: Express.Multer.File) {
    return this.authService.uploadCoverPhoto(req.user.id, file);
  }

  @Post('portfolio')
  @ApiOperation({ summary: 'Add portfolio item' })
  @ApiResponse({ status: 201, description: 'Portfolio item added successfully' })
  async addPortfolioItem(@Request() req, @Body() itemData: any) {
    return this.authService.addPortfolioItem(req.user.id, itemData);
  }

  @Put('portfolio/:id')
  @ApiOperation({ summary: 'Update portfolio item' })
  @ApiResponse({ status: 200, description: 'Portfolio item updated successfully' })
  async updatePortfolioItem(@Request() req, @Param('id') id: number, @Body() itemData: any) {
    return this.authService.updatePortfolioItem(req.user.id, id, itemData);
  }

  @Delete('portfolio/:id')
  @ApiOperation({ summary: 'Delete portfolio item' })
  @ApiResponse({ status: 200, description: 'Portfolio item deleted successfully' })
  async deletePortfolioItem(@Request() req, @Param('id') id: number) {
    return this.authService.deletePortfolioItem(req.user.id, id);
  }

  @Post('experience')
  @ApiOperation({ summary: 'Add experience' })
  @ApiResponse({ status: 201, description: 'Experience added successfully' })
  async addExperience(@Request() req, @Body() experienceData: any) {
    return this.authService.addExperience(req.user.id, experienceData);
  }

  @Put('experience/:id')
  @ApiOperation({ summary: 'Update experience' })
  @ApiResponse({ status: 200, description: 'Experience updated successfully' })
  async updateExperience(@Request() req, @Param('id') id: number, @Body() experienceData: any) {
    return this.authService.updateExperience(req.user.id, id, experienceData);
  }

  @Delete('experience/:id')
  @ApiOperation({ summary: 'Delete experience' })
  @ApiResponse({ status: 200, description: 'Experience deleted successfully' })
  async deleteExperience(@Request() req, @Param('id') id: number) {
    return this.authService.deleteExperience(req.user.id, id);
  }
}
