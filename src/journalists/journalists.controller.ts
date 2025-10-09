import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { JournalistsService } from './journalists.service';
import { CreateJournalistDto } from './dto/create-journalist.dto';
import { UpdateJournalistDto } from './dto/update-journalist.dto';
import { SearchJournalistDto } from './dto/search-journalist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('journalists')
export class JournalistsController {
  constructor(private readonly journalistsService: JournalistsService) {}

  @Post()
  create(@Body() createJournalistDto: CreateJournalistDto) {
    return this.journalistsService.create(createJournalistDto);
  }

  @Get()
  findAll(@Query() searchDto: SearchJournalistDto) {
    return this.journalistsService.findAll(searchDto);
  }

  // Journalist-specific endpoints (must come before :id routes)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.JOURNALIST)
  @Get('my/profile')
  getMyProfile(@Request() req) {
    return this.journalistsService.getMyProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.JOURNALIST)
  @Patch('my/profile')
  updateMyProfile(@Body() updateJournalistDto: UpdateJournalistDto, @Request() req) {
    return this.journalistsService.updateMyProfile(req.user.id, updateJournalistDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.JOURNALIST)
  @Get('my/applications')
  getMyApplications(@Request() req) {
    return this.journalistsService.getMyApplications(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.journalistsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJournalistDto: UpdateJournalistDto, @Request() req) {
    return this.journalistsService.update(+id, updateJournalistDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.journalistsService.remove(+id, req.user);
  }
}
