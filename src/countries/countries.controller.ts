import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('countries')
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new country' })
  @ApiResponse({ status: 201, description: 'Country created successfully' })
  create(@Body() createCountryDto: CreateCountryDto) {
    return this.countriesService.create(createCountryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all countries' })
  @ApiResponse({ status: 200, description: 'Countries retrieved successfully' })
  findAll() {
    return this.countriesService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search countries' })
  @ApiResponse({ status: 200, description: 'Countries found' })
  search(@Query('q') query: string) {
    return this.countriesService.search(query);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get country by code' })
  @ApiResponse({ status: 200, description: 'Country found' })
  findByCode(@Param('code') code: string) {
    return this.countriesService.findByCode(code);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get country by ID' })
  @ApiResponse({ status: 200, description: 'Country found' })
  findOne(@Param('id') id: string) {
    return this.countriesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update country' })
  @ApiResponse({ status: 200, description: 'Country updated successfully' })
  update(@Param('id') id: string, @Body() updateCountryDto: UpdateCountryDto) {
    return this.countriesService.update(+id, updateCountryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete country' })
  @ApiResponse({ status: 200, description: 'Country deleted successfully' })
  remove(@Param('id') id: string) {
    return this.countriesService.remove(+id);
  }
}

