import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
// Using Node.js built-in fetch (available in Node 18+)
// import axios from 'axios';
import { User, UserRole, UserStatus } from '../users/entities/user.entity';
import { Journalist } from '../journalists/entities/journalist.entity';
import { Company } from '../companies/entities/company.entity';
import { RegisteredUser } from '../registered-users/entities/registered-user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterJournalistDto } from './dto/register-journalist.dto';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { CreateRegisteredUserDto } from '../registered-users/dto/create-registered-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Journalist)
    private journalistRepository: Repository<Journalist>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(RegisteredUser)
    private registeredUserRepository: Repository<RegisteredUser>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    };
  }

  async registerJournalist(registerDto: RegisterJournalistDto) {
    const { email, password, ...journalistData } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      role: UserRole.JOURNALIST,
      status: UserStatus.PENDING,
      firstName: journalistData.name,
      phoneNumber: journalistData.phoneNumber,
      countryId: journalistData.countryId,
      city: journalistData.cityOfResidence,
    });

    const savedUser = await this.userRepository.save(user);

    // Create journalist profile
    const journalist = this.journalistRepository.create({
      ...journalistData,
      user: savedUser,
    });

    await this.journalistRepository.save(journalist);

    const payload = {
      email: savedUser.email,
      sub: savedUser.id,
      role: savedUser.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: savedUser.id,
        email: savedUser.email,
        role: savedUser.role,
        status: savedUser.status,
        profile: journalist,
      },
    };
  }

  async registerCompany(registerDto: RegisterCompanyDto) {
    const { email, password, ...companyData } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      role: UserRole.COMPANY,
      status: UserStatus.PENDING,
      firstName: companyData.name,
      phoneNumber: companyData.phoneNumber,
      countryId: companyData.countryId,
      city: companyData.city,
    });

    const savedUser = await this.userRepository.save(user);

    // Create company profile
    const company = this.companyRepository.create({
      ...companyData,
      user: savedUser,
    });

    await this.companyRepository.save(company);

    const payload = {
      email: savedUser.email,
      sub: savedUser.id,
      role: savedUser.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: savedUser.id,
        email: savedUser.email,
        role: savedUser.role,
        status: savedUser.status,
        profile: company,
      },
    };
  }

  async verifyEmail(token: string) {
    const user = await this.userRepository.findOne({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid verification token');
    }

    user.status = UserStatus.ACTIVE;
    user.emailVerified = true;
    user.emailVerificationToken = null;

    await this.userRepository.save(user);

    return { message: 'Email verified successfully' };
  }

  async requestPasswordReset(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not
      return { message: 'If the email exists, a password reset link has been sent' };
    }

    // Generate reset token
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1); // Token expires in 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;

    await this.userRepository.save(user);

    // TODO: Send email with reset link
    // For now, just return the token (in production, send via email)
    return { 
      message: 'Password reset link sent to email',
      resetToken // Remove this in production
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.userRepository.findOne({
      where: { resetPasswordToken: token },
    });

    if (!user || user.resetPasswordExpires < new Date()) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await this.userRepository.save(user);

    return { message: 'Password reset successfully' };
  }

  async registerUser(registerDto: CreateRegisteredUserDto) {
    const { email, password, ...userData } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      role: UserRole.REGISTERED_USER,
      status: UserStatus.ACTIVE,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phoneNumber: userData.phoneNumber,
      countryId: userData.countryId,
      city: userData.city,
    });

    const savedUser = await this.userRepository.save(user);

    // Create registered user profile
    const registeredUser = this.registeredUserRepository.create({
      ...userData,
      user: savedUser,
    });

    await this.registeredUserRepository.save(registeredUser);

    const payload = {
      email: savedUser.email,
      sub: savedUser.id,
      role: savedUser.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: savedUser.id,
        email: savedUser.email,
        role: savedUser.role,
        status: savedUser.status,
        profile: registeredUser,
      },
    };
  }

  // OAuth Methods
  async handleGoogleOAuth(code: string) {
    try {
      // Exchange code for access token
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          code,
          grant_type: 'authorization_code',
          redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error(`Token exchange failed: ${tokenResponse.status}`);
      }
      
      const tokenData = await tokenResponse.json();
      const { access_token } = tokenData;

      // Get user info from Google
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` }
      });

      if (!userResponse.ok) {
        throw new Error(`User info fetch failed: ${userResponse.status}`);
      }
      
      const { id, email, given_name, family_name, picture } = await userResponse.json();

      return this.handleOAuthUser({
        providerId: id,
        email,
        firstName: given_name,
        lastName: family_name,
        picture,
        provider: 'google'
      });
    } catch (error) {
      throw new UnauthorizedException('Google OAuth failed');
    }
  }

  async handleFacebookOAuth(code: string) {
    try {
      // Exchange code for access token
      const tokenUrl = new URL('https://graph.facebook.com/v18.0/oauth/access_token');
      tokenUrl.searchParams.set('client_id', process.env.FACEBOOK_APP_ID);
      tokenUrl.searchParams.set('client_secret', process.env.FACEBOOK_APP_SECRET);
      tokenUrl.searchParams.set('redirect_uri', process.env.FACEBOOK_REDIRECT_URI);
      tokenUrl.searchParams.set('code', code);

      const tokenResponse = await fetch(tokenUrl.toString());
      
      if (!tokenResponse.ok) {
        throw new Error(`Token exchange failed: ${tokenResponse.status}`);
      }
      
      const { access_token } = await tokenResponse.json();

      // Get user info from Facebook
      const userUrl = new URL('https://graph.facebook.com/v18.0/me');
      userUrl.searchParams.set('fields', 'id,email,first_name,last_name,picture');
      userUrl.searchParams.set('access_token', access_token);

      const userResponse = await fetch(userUrl.toString());
      
      if (!userResponse.ok) {
        throw new Error(`User info fetch failed: ${userResponse.status}`);
      }
      
      const { id, email, first_name, last_name, picture } = await userResponse.json();

      return this.handleOAuthUser({
        providerId: id,
        email,
        firstName: first_name,
        lastName: last_name,
        picture: picture?.data?.url,
        provider: 'facebook'
      });
    } catch (error) {
      throw new UnauthorizedException('Facebook OAuth failed');
    }
  }

  private async handleOAuthUser(oauthUser: {
    providerId: string;
    email: string;
    firstName: string;
    lastName: string;
    picture?: string;
    provider: 'google' | 'facebook';
  }) {
    // Check if user already exists
    let user = await this.userRepository.findOne({
      where: { email: oauthUser.email }
    });

    if (!user) {
      // Create new user for OAuth
      user = this.userRepository.create({
        email: oauthUser.email,
        firstName: oauthUser.firstName,
        lastName: oauthUser.lastName,
        role: UserRole.REGISTERED_USER,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        // Store OAuth provider info in a JSON field or separate table
        oauthProvider: oauthUser.provider,
        oauthProviderId: oauthUser.providerId,
      });

      user = await this.userRepository.save(user);

      // Create registered user profile
      const registeredUser = this.registeredUserRepository.create({
        user,
        bio: `Signed up via ${oauthUser.provider}`,
        profilePicture: oauthUser.picture,
      });

      await this.registeredUserRepository.save(registeredUser);
    }

    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    };
  }

  getGoogleAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  getFacebookAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: process.env.FACEBOOK_APP_ID,
      redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
      response_type: 'code',
      scope: 'email,public_profile',
    });

    return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
  }
}
