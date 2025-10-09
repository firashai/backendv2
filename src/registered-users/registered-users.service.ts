import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisteredUser } from './entities/registered-user.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { Journalist, SocialMediaPlatform } from '../journalists/entities/journalist.entity';
import { Company } from '../companies/entities/company.entity';
import { CreateRegisteredUserDto } from './dto/create-registered-user.dto';
import { UpdateRegisteredUserDto } from './dto/update-registered-user.dto';
import { UpgradeProfileDto } from './dto/upgrade-profile.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegisteredUsersService {
  constructor(
    @InjectRepository(RegisteredUser)
    private registeredUserRepository: Repository<RegisteredUser>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Journalist)
    private journalistRepository: Repository<Journalist>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async create(createRegisteredUserDto: CreateRegisteredUserDto): Promise<RegisteredUser> {
    const { email, password, ...profileData } = createRegisteredUserDto;

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
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      phoneNumber: profileData.phoneNumber,
      countryId: profileData.countryId,
      city: profileData.city,
    });

    const savedUser = await this.userRepository.save(user);

    // Create registered user profile
    const registeredUser = this.registeredUserRepository.create({
      ...profileData,
      user: savedUser,
    });

    return this.registeredUserRepository.save(registeredUser);
  }

  async findOne(id: number): Promise<RegisteredUser> {
    const registeredUser = await this.registeredUserRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!registeredUser) {
      throw new NotFoundException('Registered user not found');
    }

    return registeredUser;
  }

  async findByUserId(userId: number): Promise<RegisteredUser> {
    const registeredUser = await this.registeredUserRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!registeredUser) {
      throw new NotFoundException('Registered user not found');
    }

    return registeredUser;
  }

  async update(id: number, updateRegisteredUserDto: UpdateRegisteredUserDto): Promise<RegisteredUser> {
    const registeredUser = await this.findOne(id);

    Object.assign(registeredUser, updateRegisteredUserDto);
    return this.registeredUserRepository.save(registeredUser);
  }

  async updateByUserId(userId: number, updateRegisteredUserDto: UpdateRegisteredUserDto): Promise<RegisteredUser> {
    const registeredUser = await this.findByUserId(userId);

    Object.assign(registeredUser, updateRegisteredUserDto);
    return this.registeredUserRepository.save(registeredUser);
  }

  async upgradeProfile(userId: number, upgradeProfileDto: UpgradeProfileDto): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['registeredUser'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== UserRole.REGISTERED_USER) {
      throw new ConflictException('User is not a registered user');
    }

    const { upgradeType, ...profileData } = upgradeProfileDto;

    if (upgradeType === 'journalist') {
      // Create journalist profile
      const journalist = this.journalistRepository.create({
        bio: profileData.bio,
        // Note: skills, languages, and other fields are now handled by junction tables
        // These will need to be set up separately after the journalist is created
        socialMediaAccounts: profileData.socialMedia ? Object.entries(profileData.socialMedia)
          .filter(([key, value]) => value)
          .map(([platform, url]) => ({
            platform: platform === 'facebook' ? SocialMediaPlatform.FACEBOOK : 
                     platform === 'twitter' ? SocialMediaPlatform.TWITTER : 
                     platform === 'youtube' ? SocialMediaPlatform.YOUTUBE : SocialMediaPlatform.OTHER,
            url: url
          })) : [],
        user: user,
      });

      await this.journalistRepository.save(journalist);

      // Update user role
      user.role = UserRole.JOURNALIST;
      await this.userRepository.save(user);

      return {
        message: 'Profile upgraded to journalist successfully',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          profile: journalist,
        },
      };
    } else if (upgradeType === 'company') {
      // Create company profile
      const company = this.companyRepository.create({
        name: profileData.companyName || `${user.firstName} ${user.lastName}`,
        description: profileData.description || profileData.bio,
        website: profileData.website,
        // Note: industry, companySize, and other fields are now handled by junction tables
        // These will need to be set up separately after the company is created
        socialMediaAccounts: profileData.socialMedia ? Object.entries(profileData.socialMedia)
          .filter(([key, value]) => value)
          .map(([platform, url]) => ({
            platform: platform,
            url: url
          })) : [],
        user: user,
      });

      await this.companyRepository.save(company);

      // Update user role
      user.role = UserRole.COMPANY;
      await this.userRepository.save(user);

      return {
        message: 'Profile upgraded to company successfully',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          profile: company,
        },
      };
    }

    throw new ConflictException('Invalid upgrade type');
  }

  async getStats(userId: number): Promise<any> {
    const registeredUser = await this.findByUserId(userId);

    return {
      totalMediaUploads: registeredUser.totalMediaUploads,
      totalMediaViews: registeredUser.totalMediaViews,
      totalMediaSales: registeredUser.totalMediaSales,
      totalEarnings: registeredUser.totalEarnings,
    };
  }

  async updateStats(userId: number, stats: Partial<{
    totalMediaUploads: number;
    totalMediaViews: number;
    totalMediaSales: number;
    totalEarnings: number;
  }>): Promise<void> {
    const registeredUser = await this.findByUserId(userId);

    Object.assign(registeredUser, stats);
    await this.registeredUserRepository.save(registeredUser);
  }
}
