import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('skills')
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new skill' })
  @ApiResponse({ status: 201, description: 'Skill created successfully' })
  create(@Body() createSkillDto: CreateSkillDto) {
    return this.skillsService.create(createSkillDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all skills' })
  @ApiResponse({ status: 200, description: 'Skills retrieved successfully' })
  findAll(@Query('category') category?: string) {
    if (category) {
      return this.skillsService.findByCategory(category);
    }
    return this.skillsService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search skills' })
  @ApiResponse({ status: 200, description: 'Skills found' })
  search(@Query('q') query: string) {
    return this.skillsService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get skill by ID' })
  @ApiResponse({ status: 200, description: 'Skill found' })
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update skill' })
  @ApiResponse({ status: 200, description: 'Skill updated successfully' })
  update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
    return this.skillsService.update(+id, updateSkillDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete skill' })
  @ApiResponse({ status: 200, description: 'Skill deleted successfully' })
  remove(@Param('id') id: string) {
    return this.skillsService.remove(+id);
  }
}

