import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
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
      country: journalistData.country,
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
      country: companyData.country,
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
      country: userData.country,
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
}
