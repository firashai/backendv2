import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { JournalistsModule } from './journalists/journalists.module';
import { MediaContentModule } from './media-content/media-content.module';
import { JobsModule } from './jobs/jobs.module';
import { SearchModule } from './search/search.module';
import { AdminModule } from './admin/admin.module';
import { RegisteredUsersModule } from './registered-users/registered-users.module';
import { SkillsModule } from './skills/skills.module';
import { MediaWorkTypesModule } from './media-work-types/media-work-types.module';
import { AnalystSpecialtyModule } from './analyst-specialty/analyst-specialty.module';
import { CountriesModule } from './countries/countries.module';
import { LanguagesModule } from './languages/languages.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Temporarily enabled to create tables
        logging: configService.get('NODE_ENV') === 'development',
        // Connection pool configuration to prevent "max_user_connections" error
        extra: {
          connectionLimit: 5, // Reduce connection pool size
          acquireTimeout: 60000, // 60 seconds
          timeout: 60000, // 60 seconds
          reconnect: true,
          charset: 'utf8mb4',
        },
        // Additional connection options
        maxQueryExecutionTime: 10000, // 10 seconds
        cache: {
          duration: 30000, // 30 seconds
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule,
    AuthModule,
    UsersModule,
    CompaniesModule,
    JournalistsModule,
    MediaContentModule,
    JobsModule,
    SearchModule,
    AdminModule,
    RegisteredUsersModule,
    SkillsModule,
    MediaWorkTypesModule,
    AnalystSpecialtyModule,
    CountriesModule,
    LanguagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
