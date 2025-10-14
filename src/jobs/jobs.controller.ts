import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ApplyForJobDto } from './dto/apply-for-job.dto';
import { SearchJobDto } from './dto/search-job.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createJobDto: CreateJobDto, @Request() req) {
    return this.jobsService.create(createJobDto, req.user);
  }

  @Get()
  findAll(@Query() query: any) {
    // Handle skills[] and languages[] parameter names and ensure they are arrays
    const searchDto: SearchJobDto = {
      ...query,
      skills: this.normalizeArrayParam(query.skills || query['skills[]']),
      languages: this.normalizeArrayParam(query.languages || query['languages[]'])
    };

    // Support multi-select for media work types, locations, and job types
    const mediaWorkTypes = this.normalizeArrayParam(
      query.mediaWorkTypes || query['mediaWorkTypes[]'] || query['mediaWorkType[]']
    );
    const locations = this.normalizeArrayParam(
      query.locations || query['locations[]']
    );
    const jobTypes = this.normalizeArrayParam(
      query.jobTypes || query['jobTypes[]']
    );

    if (mediaWorkTypes && mediaWorkTypes.length > 0) {
      // @ts-ignore augment search dto dynamically
      (searchDto as any).mediaWorkTypes = mediaWorkTypes;
    }

    if (locations && locations.length > 0) {
      // @ts-ignore
      (searchDto as any).locations = locations;
    }

    if (jobTypes && jobTypes.length > 0) {
      // @ts-ignore
      (searchDto as any).jobTypes = jobTypes;
    }

    return this.jobsService.findAll(searchDto);
  }

  private normalizeArrayParam(value: any): string[] | undefined {
    if (!value) return undefined;
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') return [value];
    return undefined;
  }

  @Get('company/:companyId')
  findByCompany(@Param('companyId') companyId: string) {
    return this.jobsService.findByCompany(+companyId);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.jobsService.findByUser(+userId);
  }

  @Get('applications/user/:userId')
  findApplicationsByUser(@Param('userId') userId: string) {
    return this.jobsService.findApplicationsByUser(+userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(+id);
  }

  @Get(':id/similar')
  findSimilarJobs(@Param('id') id: string) {
    return this.jobsService.findSimilarJobs(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto, @Request() req) {
    return this.jobsService.update(+id, updateJobDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.jobsService.remove(+id, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/apply')
  applyForJob(@Param('id') id: string, @Body() applyForJobDto: ApplyForJobDto, @Request() req) {
    return this.jobsService.applyForJob(+id, applyForJobDto, req.user);
  }
}
