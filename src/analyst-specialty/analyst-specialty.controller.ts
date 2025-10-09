import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AnalystSpecialtyService } from './analyst-specialty.service';
import { CreateAnalystSpecialtyDto } from './dto/create-analyst-specialty.dto';
import { UpdateAnalystSpecialtyDto } from './dto/update-analyst-specialty.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('analyst-specialty')
@Controller('analyst-specialty')
export class AnalystSpecialtyController {
  constructor(private readonly analystSpecialtyService: AnalystSpecialtyService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new analyst specialty' })
  @ApiResponse({ status: 201, description: 'Analyst specialty created successfully' })
  create(@Body() createAnalystSpecialtyDto: CreateAnalystSpecialtyDto) {
    return this.analystSpecialtyService.create(createAnalystSpecialtyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all analyst specialties' })
  @ApiResponse({ status: 200, description: 'Analyst specialties retrieved successfully' })
  findAll() {
    return this.analystSpecialtyService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search analyst specialties' })
  @ApiResponse({ status: 200, description: 'Analyst specialties found' })
  search(@Query('q') query: string) {
    return this.analystSpecialtyService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get analyst specialty by ID' })
  @ApiResponse({ status: 200, description: 'Analyst specialty found' })
  findOne(@Param('id') id: string) {
    return this.analystSpecialtyService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update analyst specialty' })
  @ApiResponse({ status: 200, description: 'Analyst specialty updated successfully' })
  update(@Param('id') id: string, @Body() updateAnalystSpecialtyDto: UpdateAnalystSpecialtyDto) {
    return this.analystSpecialtyService.update(+id, updateAnalystSpecialtyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete analyst specialty' })
  @ApiResponse({ status: 200, description: 'Analyst specialty deleted successfully' })
  remove(@Param('id') id: string) {
    return this.analystSpecialtyService.remove(+id);
  }
}

