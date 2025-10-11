import { Controller, Post, Body, Get, Query, Res, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';

@ApiTags('OAuth Authentication')
@Controller('auth')
export class OAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google/callback')
  @ApiOperation({ summary: 'Handle Google OAuth callback' })
  @ApiResponse({ status: 200, description: 'Google OAuth successful' })
  @ApiResponse({ status: 400, description: 'Invalid OAuth code' })
  async handleGoogleCallback(@Body() body: { code: string }) {
    return this.authService.handleGoogleOAuth(body.code);
  }

  @Post('facebook/callback')
  @ApiOperation({ summary: 'Handle Facebook OAuth callback' })
  @ApiResponse({ status: 200, description: 'Facebook OAuth successful' })
  @ApiResponse({ status: 400, description: 'Invalid OAuth code' })
  async handleFacebookCallback(@Body() body: { code: string }) {
    return this.authService.handleFacebookOAuth(body.code);
  }

  @Get('google')
  @ApiOperation({ summary: 'Initiate Google OAuth' })
  async initiateGoogleAuth(@Res() res: Response) {
    const authUrl = this.authService.getGoogleAuthUrl();
    res.redirect(authUrl);
  }

  @Get('facebook')
  @ApiOperation({ summary: 'Initiate Facebook OAuth' })
  async initiateFacebookAuth(@Res() res: Response) {
    const authUrl = this.authService.getFacebookAuthUrl();
    res.redirect(authUrl);
  }
}
