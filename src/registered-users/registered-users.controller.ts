import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RegisteredUsersService } from './registered-users.service';
import { CreateRegisteredUserDto } from './dto/create-registered-user.dto';
import { UpdateRegisteredUserDto } from './dto/update-registered-user.dto';
import { UpgradeProfileDto } from './dto/upgrade-profile.dto';

@ApiTags('Registered Users')
@Controller('registered-users')
export class RegisteredUsersController {
  constructor(private readonly registeredUsersService: RegisteredUsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new registered user' })
  @ApiResponse({ status: 201, description: 'Registered user created successfully' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async create(@Body() createRegisteredUserDto: CreateRegisteredUserDto) {
    return this.registeredUsersService.create(createRegisteredUserDto);
  }

  @Get('my/profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getMyProfile(@Request() req) {
    return this.registeredUsersService.findByUserId(req.user.id);
  }

  @Patch('my/profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async updateMyProfile(@Request() req, @Body() updateRegisteredUserDto: UpdateRegisteredUserDto) {
    return this.registeredUsersService.updateByUserId(req.user.id, updateRegisteredUserDto);
  }

  @Post('my/upgrade')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Upgrade profile to journalist or company' })
  @ApiResponse({ status: 200, description: 'Profile upgraded successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'User is not a registered user or invalid upgrade type' })
  async upgradeProfile(@Request() req, @Body() upgradeProfileDto: UpgradeProfileDto) {
    return this.registeredUsersService.upgradeProfile(req.user.id, upgradeProfileDto);
  }

  @Get('my/stats')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getMyStats(@Request() req) {
    return this.registeredUsersService.getStats(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get registered user by ID' })
  @ApiResponse({ status: 200, description: 'Registered user retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Registered user not found' })
  async findOne(@Param('id') id: string) {
    return this.registeredUsersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update registered user by ID' })
  @ApiResponse({ status: 200, description: 'Registered user updated successfully' })
  @ApiResponse({ status: 404, description: 'Registered user not found' })
  async update(@Param('id') id: string, @Body() updateRegisteredUserDto: UpdateRegisteredUserDto) {
    return this.registeredUsersService.update(+id, updateRegisteredUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete registered user by ID' })
  @ApiResponse({ status: 200, description: 'Registered user deleted successfully' })
  @ApiResponse({ status: 404, description: 'Registered user not found' })
  async remove(@Param('id') id: string) {
    // This would typically be handled by the user service
    return { message: 'User deletion not implemented' };
  }
}
