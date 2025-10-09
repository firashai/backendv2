import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, UserStatus } from '../users/entities/user.entity';
import { JobStatus } from '../jobs/entities/job.entity';
import { MediaStatus } from '../media-content/entities/media-content.entity';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Dashboard
  @Get('dashboard')
  @ApiOperation({ summary: 'Get admin dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Dashboard statistics retrieved successfully' })
  async getDashboardStats() {
    return await this.adminService.getDashboardStats();
  }

  // User Management
  @Get('users')
  @ApiOperation({ summary: 'Get all users with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
    @Query('role') role?: string,
  ) {
    const userStatus = status ? (status as UserStatus) : undefined;
    const userRole = role ? (role as UserRole) : undefined;
    return await this.adminService.getAllUsers(page, limit, userStatus, userRole);
  }

  @Put('users/:id/status')
  @ApiOperation({ summary: 'Update user status' })
  @ApiResponse({ status: 200, description: 'User status updated successfully' })
  async updateUserStatus(
    @Param('id') userId: number,
    @Body('status') status: string,
    @Request() req,
  ) {
    return await this.adminService.updateUserStatus(userId, status as UserStatus, req.user.id);
  }

  // Journalist Management
  @Get('journalists')
  @ApiOperation({ summary: 'Get all journalists with pagination and approval filter' })
  @ApiResponse({ status: 200, description: 'Journalists retrieved successfully' })
  async getAllJournalists(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('approved') approved?: boolean,
  ) {
    return await this.adminService.getAllJournalists(page, limit, approved);
  }

  @Put('journalists/:id/approve')
  @ApiOperation({ summary: 'Approve or reject a journalist' })
  @ApiResponse({ status: 200, description: 'Journalist approval status updated successfully' })
  async approveJournalist(
    @Param('id') journalistId: number,
    @Body() body: { approved: boolean; notes?: string },
    @Request() req,
  ) {
    return await this.adminService.approveJournalist(
      journalistId,
      body.approved,
      req.user.id,
      body.notes,
    );
  }

  @Post('journalists/bulk-approve')
  @ApiOperation({ summary: 'Bulk approve or reject journalists' })
  @ApiResponse({ status: 200, description: 'Journalists bulk approval completed successfully' })
  async bulkApproveJournalists(
    @Body() body: { journalistIds: number[]; approved: boolean },
    @Request() req,
  ) {
    return await this.adminService.bulkApproveJournalists(
      body.journalistIds,
      body.approved,
      req.user.id,
    );
  }

  @Put('journalists/:id')
  @ApiOperation({ summary: 'Update journalist information' })
  @ApiResponse({ status: 200, description: 'Journalist updated successfully' })
  async updateJournalist(
    @Param('id') journalistId: number,
    @Body() updateData: any,
    @Request() req,
  ) {
    return await this.adminService.updateJournalist(journalistId, updateData, req.user.id);
  }

  // Company Management
  @Get('companies')
  @ApiOperation({ summary: 'Get all companies with pagination and verification filter' })
  @ApiResponse({ status: 200, description: 'Companies retrieved successfully' })
  async getAllCompanies(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('verified') verified?: boolean,
  ) {
    return await this.adminService.getAllCompanies(page, limit, verified);
  }

  @Put('companies/:id/approve')
  @ApiOperation({ summary: 'Approve or reject a company' })
  @ApiResponse({ status: 200, description: 'Company approval status updated successfully' })
  async approveCompany(
    @Param('id') companyId: number,
    @Body() body: { approved: boolean; notes?: string },
    @Request() req,
  ) {
    return await this.adminService.approveCompany(
      companyId,
      body.approved,
      req.user.id,
      body.notes,
    );
  }

  @Post('companies/bulk-approve')
  @ApiOperation({ summary: 'Bulk approve or reject companies' })
  @ApiResponse({ status: 200, description: 'Companies bulk approval completed successfully' })
  async bulkApproveCompanies(
    @Body() body: { companyIds: number[]; approved: boolean },
    @Request() req,
  ) {
    return await this.adminService.bulkApproveCompanies(
      body.companyIds,
      body.approved,
      req.user.id,
    );
  }

  @Put('companies/:id')
  @ApiOperation({ summary: 'Update company information' })
  @ApiResponse({ status: 200, description: 'Company updated successfully' })
  async updateCompany(
    @Param('id') companyId: number,
    @Body() updateData: any,
    @Request() req,
  ) {
    return await this.adminService.updateCompany(companyId, updateData, req.user.id);
  }

  // Job Management
  @Get('jobs')
  @ApiOperation({ summary: 'Get all jobs with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Jobs retrieved successfully' })
  async getAllJobs(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('approved') approved?: boolean,
    @Query('status') status?: string,
  ) {
    const jobStatus = status ? (status as JobStatus) : undefined;
    return await this.adminService.getAllJobs(page, limit, approved, jobStatus);
  }

  @Put('jobs/:id/approve')
  @ApiOperation({ summary: 'Approve or reject a job' })
  @ApiResponse({ status: 200, description: 'Job approval status updated successfully' })
  async approveJob(
    @Param('id') jobId: number,
    @Body() body: { approved: boolean; notes?: string },
    @Request() req,
  ) {
    return await this.adminService.approveJob(
      jobId,
      body.approved,
      req.user.id,
      body.notes,
    );
  }

  @Post('jobs/bulk-approve')
  @ApiOperation({ summary: 'Bulk approve or reject jobs' })
  @ApiResponse({ status: 200, description: 'Jobs bulk approval completed successfully' })
  async bulkApproveJobs(
    @Body() body: { jobIds: number[]; approved: boolean },
    @Request() req,
  ) {
    return await this.adminService.bulkApproveJobs(
      body.jobIds,
      body.approved,
      req.user.id,
    );
  }

  @Put('jobs/:id')
  @ApiOperation({ summary: 'Update job information' })
  @ApiResponse({ status: 200, description: 'Job updated successfully' })
  async updateJob(
    @Param('id') jobId: number,
    @Body() updateData: any,
    @Request() req,
  ) {
    return await this.adminService.updateJob(jobId, updateData, req.user.id);
  }

  // Media Content Management
  @Get('media')
  @ApiOperation({ summary: 'Get all media content with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Media content retrieved successfully' })
  async getAllMediaContent(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('approved') approved?: boolean,
    @Query('status') status?: string,
  ) {
    const mediaStatus = status ? (status as MediaStatus) : undefined;
    return await this.adminService.getAllMediaContent(page, limit, approved, mediaStatus);
  }

  @Put('media/:id/approve')
  @ApiOperation({ summary: 'Approve or reject media content' })
  @ApiResponse({ status: 200, description: 'Media content approval status updated successfully' })
  async approveMediaContent(
    @Param('id') mediaId: number,
    @Body() body: { approved: boolean; notes?: string },
    @Request() req,
  ) {
    return await this.adminService.approveMediaContent(
      mediaId,
      body.approved,
      req.user.id,
      body.notes,
    );
  }

  @Post('media/bulk-approve')
  @ApiOperation({ summary: 'Bulk approve or reject media content' })
  @ApiResponse({ status: 200, description: 'Media content bulk approval completed successfully' })
  async bulkApproveMediaContent(
    @Body() body: { mediaIds: number[]; approved: boolean },
    @Request() req,
  ) {
    return await this.adminService.bulkApproveMediaContent(
      body.mediaIds,
      body.approved,
      req.user.id,
    );
  }

  @Put('media/:id')
  @ApiOperation({ summary: 'Update media content information' })
  @ApiResponse({ status: 200, description: 'Media content updated successfully' })
  async updateMediaContent(
    @Param('id') mediaId: number,
    @Body() updateData: any,
    @Request() req,
  ) {
    return await this.adminService.updateMediaContent(mediaId, updateData, req.user.id);
  }

  // Application Management
  @Get('applications')
  @ApiOperation({ summary: 'Get all job applications with pagination' })
  @ApiResponse({ status: 200, description: 'Applications retrieved successfully' })
  async getAllApplications(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.adminService.getAllApplications(page, limit);
  }

  // Purchase Management
  @Get('purchases')
  @ApiOperation({ summary: 'Get all media purchases with pagination' })
  @ApiResponse({ status: 200, description: 'Purchases retrieved successfully' })
  async getAllPurchases(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.adminService.getAllPurchases(page, limit);
  }
}

