import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('languages')
@Controller('languages')
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new language' })
  @ApiResponse({ status: 201, description: 'Language created successfully' })
  create(@Body() createLanguageDto: CreateLanguageDto) {
    return this.languagesService.create(createLanguageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all languages' })
  @ApiResponse({ status: 200, description: 'Languages retrieved successfully' })
  findAll() {
    return this.languagesService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search languages' })
  @ApiResponse({ status: 200, description: 'Languages found' })
  search(@Query('q') query: string) {
    return this.languagesService.search(query);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get language by code' })
  @ApiResponse({ status: 200, description: 'Language found' })
  findByCode(@Param('code') code: string) {
    return this.languagesService.findByCode(code);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get language by ID' })
  @ApiResponse({ status: 200, description: 'Language found' })
  findOne(@Param('id') id: string) {
    return this.languagesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update language' })
  @ApiResponse({ status: 200, description: 'Language updated successfully' })
  update(@Param('id') id: string, @Body() updateLanguageDto: UpdateLanguageDto) {
    return this.languagesService.update(+id, updateLanguageDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete language' })
  @ApiResponse({ status: 200, description: 'Language deleted successfully' })
  remove(@Param('id') id: string) {
    return this.languagesService.remove(+id);
  }
}

