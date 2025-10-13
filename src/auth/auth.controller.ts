import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterJournalistDto } from './dto/register-journalist.dto';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { CreateRegisteredUserDto } from '../registered-users/dto/create-registered-user.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register/journalist')
  @ApiOperation({ summary: 'Journalist registration' })
  @ApiResponse({ status: 201, description: 'Journalist registration successful' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async registerJournalist(@Body() registerDto: RegisterJournalistDto) {
    return this.authService.registerJournalist(registerDto);
  }

  @Post('register/company')
  @ApiOperation({ summary: 'Company registration' })
  @ApiResponse({ status: 201, description: 'Company registration successful' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async registerCompany(@Body() registerDto: RegisterCompanyDto) {
    return this.authService.registerCompany(registerDto);
  }

  @Post('register/user')
  @ApiOperation({ summary: 'Registered user registration' })
  @ApiResponse({ status: 201, description: 'User registration successful' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async registerUser(@Body() registerDto: CreateRegisteredUserDto) {
    return this.authService.registerUser(registerDto);
  }

  @Get('verify-email/:token')
  @ApiOperation({ summary: 'Verify email address' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid verification token' })
  async verifyEmail(@Param('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('request-password-reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  @ApiResponse({ status: 400, description: 'User not found' })
  async requestPasswordReset(@Body('email') email: string) {
    return this.authService.requestPasswordReset(email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.resetPassword(token, newPassword);
  }

}
