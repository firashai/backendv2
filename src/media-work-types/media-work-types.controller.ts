import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MediaWorkTypesService } from './media-work-types.service';
import { CreateMediaWorkTypeDto } from './dto/create-media-work-type.dto';
import { UpdateMediaWorkTypeDto } from './dto/update-media-work-type.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('media-work-types')
@Controller('media-work-types')
export class MediaWorkTypesController {
  constructor(private readonly mediaWorkTypesService: MediaWorkTypesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new media work type' })
  @ApiResponse({ status: 201, description: 'Media work type created successfully' })
  create(@Body() createMediaWorkTypeDto: CreateMediaWorkTypeDto) {
    return this.mediaWorkTypesService.create(createMediaWorkTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all media work types' })
  @ApiResponse({ status: 200, description: 'Media work types retrieved successfully' })
  findAll() {
    return this.mediaWorkTypesService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search media work types' })
  @ApiResponse({ status: 200, description: 'Media work types found' })
  search(@Query('q') query: string) {
    return this.mediaWorkTypesService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get media work type by ID' })
  @ApiResponse({ status: 200, description: 'Media work type found' })
  findOne(@Param('id') id: string) {
    return this.mediaWorkTypesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update media work type' })
  @ApiResponse({ status: 200, description: 'Media work type updated successfully' })
  update(@Param('id') id: string, @Body() updateMediaWorkTypeDto: UpdateMediaWorkTypeDto) {
    return this.mediaWorkTypesService.update(+id, updateMediaWorkTypeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete media work type' })
  @ApiResponse({ status: 200, description: 'Media work type deleted successfully' })
  remove(@Param('id') id: string) {
    return this.mediaWorkTypesService.remove(+id);
  }
}

