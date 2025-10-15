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
  @ApiOperation({ summary: 'Get all job applications with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Applications retrieved successfully' })
  async getAllApplications(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
    @Query('jobId') jobId?: number,
  ) {
    return await this.adminService.getAllApplications(page, limit, status, jobId);
  }

  @Put('applications/:id/status')
  @ApiOperation({ summary: 'Update application status' })
  @ApiResponse({ status: 200, description: 'Application status updated successfully' })
  async updateApplicationStatus(
    @Param('id') applicationId: number,
    @Body('status') status: string,
    @Request() req,
    @Body('notes') notes?: string,
  ) {
    return await this.adminService.updateApplicationStatus(applicationId, status, req.user.id, notes);
  }

  @Post('applications/bulk-update')
  @ApiOperation({ summary: 'Bulk update application statuses' })
  @ApiResponse({ status: 200, description: 'Applications bulk update completed successfully' })
  async bulkUpdateApplications(
    @Body() body: { applicationIds: number[]; status: string; notes?: string },
    @Request() req,
  ) {
    return await this.adminService.bulkUpdateApplications(
      body.applicationIds,
      body.status,
      req.user.id,
      body.notes,
    );
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

  // Lookup Tables Management
  @Get('lookup/skills')
  @ApiOperation({ summary: 'Get all skills for lookup management' })
  @ApiResponse({ status: 200, description: 'Skills retrieved successfully' })
  async getSkills(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
    @Query('search') search?: string,
  ) {
    return await this.adminService.getSkills(page, limit, search);
  }

  @Post('lookup/skills')
  @ApiOperation({ summary: 'Create a new skill' })
  @ApiResponse({ status: 201, description: 'Skill created successfully' })
  async createSkill(@Body() createSkillDto: any) {
    return await this.adminService.createSkill(createSkillDto);
  }

  @Put('lookup/skills/:id')
  @ApiOperation({ summary: 'Update a skill' })
  @ApiResponse({ status: 200, description: 'Skill updated successfully' })
  async updateSkill(@Param('id') id: number, @Body() updateSkillDto: any) {
    return await this.adminService.updateSkill(id, updateSkillDto);
  }

  @Delete('lookup/skills/:id')
  @ApiOperation({ summary: 'Delete a skill' })
  @ApiResponse({ status: 200, description: 'Skill deleted successfully' })
  async deleteSkill(@Param('id') id: number) {
    return await this.adminService.deleteSkill(id);
  }

  @Get('lookup/countries')
  @ApiOperation({ summary: 'Get all countries for lookup management' })
  @ApiResponse({ status: 200, description: 'Countries retrieved successfully' })
  async getCountries(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
    @Query('search') search?: string,
  ) {
    return await this.adminService.getCountries(page, limit, search);
  }

  @Post('lookup/countries')
  @ApiOperation({ summary: 'Create a new country' })
  @ApiResponse({ status: 201, description: 'Country created successfully' })
  async createCountry(@Body() createCountryDto: any) {
    return await this.adminService.createCountry(createCountryDto);
  }

  @Put('lookup/countries/:id')
  @ApiOperation({ summary: 'Update a country' })
  @ApiResponse({ status: 200, description: 'Country updated successfully' })
  async updateCountry(@Param('id') id: number, @Body() updateCountryDto: any) {
    return await this.adminService.updateCountry(id, updateCountryDto);
  }

  @Delete('lookup/countries/:id')
  @ApiOperation({ summary: 'Delete a country' })
  @ApiResponse({ status: 200, description: 'Country deleted successfully' })
  async deleteCountry(@Param('id') id: number) {
    return await this.adminService.deleteCountry(id);
  }

  @Get('lookup/languages')
  @ApiOperation({ summary: 'Get all languages for lookup management' })
  @ApiResponse({ status: 200, description: 'Languages retrieved successfully' })
  async getLanguages(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
    @Query('search') search?: string,
  ) {
    return await this.adminService.getLanguages(page, limit, search);
  }

  @Post('lookup/languages')
  @ApiOperation({ summary: 'Create a new language' })
  @ApiResponse({ status: 201, description: 'Language created successfully' })
  async createLanguage(@Body() createLanguageDto: any) {
    return await this.adminService.createLanguage(createLanguageDto);
  }

  @Put('lookup/languages/:id')
  @ApiOperation({ summary: 'Update a language' })
  @ApiResponse({ status: 200, description: 'Language updated successfully' })
  async updateLanguage(@Param('id') id: number, @Body() updateLanguageDto: any) {
    return await this.adminService.updateLanguage(id, updateLanguageDto);
  }

  @Delete('lookup/languages/:id')
  @ApiOperation({ summary: 'Delete a language' })
  @ApiResponse({ status: 200, description: 'Language deleted successfully' })
  async deleteLanguage(@Param('id') id: number) {
    return await this.adminService.deleteLanguage(id);
  }

  @Get('lookup/analyst-specialties')
  @ApiOperation({ summary: 'Get all analyst specialties for lookup management' })
  @ApiResponse({ status: 200, description: 'Analyst specialties retrieved successfully' })
  async getAnalystSpecialties(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
    @Query('search') search?: string,
  ) {
    return await this.adminService.getAnalystSpecialties(page, limit, search);
  }

  @Post('lookup/analyst-specialties')
  @ApiOperation({ summary: 'Create a new analyst specialty' })
  @ApiResponse({ status: 201, description: 'Analyst specialty created successfully' })
  async createAnalystSpecialty(@Body() createAnalystSpecialtyDto: any) {
    return await this.adminService.createAnalystSpecialty(createAnalystSpecialtyDto);
  }

  @Put('lookup/analyst-specialties/:id')
  @ApiOperation({ summary: 'Update an analyst specialty' })
  @ApiResponse({ status: 200, description: 'Analyst specialty updated successfully' })
  async updateAnalystSpecialty(@Param('id') id: number, @Body() updateAnalystSpecialtyDto: any) {
    return await this.adminService.updateAnalystSpecialty(id, updateAnalystSpecialtyDto);
  }

  @Delete('lookup/analyst-specialties/:id')
  @ApiOperation({ summary: 'Delete an analyst specialty' })
  @ApiResponse({ status: 200, description: 'Analyst specialty deleted successfully' })
  async deleteAnalystSpecialty(@Param('id') id: number) {
    return await this.adminService.deleteAnalystSpecialty(id);
  }

  @Get('lookup/media-work-types')
  @ApiOperation({ summary: 'Get all media work types for lookup management' })
  @ApiResponse({ status: 200, description: 'Media work types retrieved successfully' })
  async getMediaWorkTypes(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
    @Query('search') search?: string,
  ) {
    return await this.adminService.getMediaWorkTypes(page, limit, search);
  }

  @Post('lookup/media-work-types')
  @ApiOperation({ summary: 'Create a new media work type' })
  @ApiResponse({ status: 201, description: 'Media work type created successfully' })
  async createMediaWorkType(@Body() createMediaWorkTypeDto: any) {
    return await this.adminService.createMediaWorkType(createMediaWorkTypeDto);
  }

  @Put('lookup/media-work-types/:id')
  @ApiOperation({ summary: 'Update a media work type' })
  @ApiResponse({ status: 200, description: 'Media work type updated successfully' })
  async updateMediaWorkType(@Param('id') id: number, @Body() updateMediaWorkTypeDto: any) {
    return await this.adminService.updateMediaWorkType(id, updateMediaWorkTypeDto);
  }

  @Delete('lookup/media-work-types/:id')
  @ApiOperation({ summary: 'Delete a media work type' })
  @ApiResponse({ status: 200, description: 'Media work type deleted successfully' })
  async deleteMediaWorkType(@Param('id') id: number) {
    return await this.adminService.deleteMediaWorkType(id);
  }

  // User Management - Password Reset
  @Post('users/:id/reset-password')
  @ApiOperation({ summary: 'Reset user password' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  async resetUserPassword(
    @Param('id') userId: number,
    @Body('newPassword') newPassword: string,
    @Request() req,
  ) {
    return await this.adminService.resetUserPassword(userId, newPassword, req.user.id);
  }

  // Enhanced Statistics
  @Get('statistics/detailed')
  @ApiOperation({ summary: 'Get detailed statistics for dashboard' })
  @ApiResponse({ status: 200, description: 'Detailed statistics retrieved successfully' })
  async getDetailedStatistics() {
    return await this.adminService.getDetailedStatistics();
  }
}

