// import { NestFactory } from '@nestjs/core';
// import { ValidationPipe } from '@nestjs/common';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { AppModule } from './app.module';
// import { NestExpressApplication } from '@nestjs/platform-express';
// import { join } from 'path';

// async function bootstrap() {
//   const app = await NestFactory.create<NestExpressApplication>(AppModule);

//   // Enable CORS with more permissive settings for development
//   app.enableCors({
//     origin: [
//       'http://localhost:3000',
//       'http://localhost:3001',
//       'http://127.0.0.1:3000',
//       'http://127.0.0.1:3001',
//       'http://localhost:3002',
//       'http://127.0.0.1:3002',
//     ],
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
//   });

//   // Global validation pipe
//   app.useGlobalPipes(new ValidationPipe({
//     whitelist: true,
//     forbidNonWhitelisted: true,
//     transform: true,
//   }));

//   // Global exception filter for file upload errors
//   app.use((error, req, res, next) => {
//     if (error.code === 'LIMIT_FILE_SIZE') {
//       return res.status(400).json({
//         message: 'File too large. Maximum size is 100MB.',
//         error: 'FILE_TOO_LARGE'
//       });
//     }
//     if (error.message === 'Invalid file type') {
//       return res.status(400).json({
//         message: 'Invalid file type. Please upload a supported file format.',
//         error: 'INVALID_FILE_TYPE'
//       });
//     }
//     next(error);
//   });

//   // Serve static files from uploads directory
//   app.useStaticAssets(join(__dirname, '..', 'uploads'), {
//     prefix: '/uploads/',
//   });

//   // Swagger documentation
//   const config = new DocumentBuilder()
//     .setTitle('WeSourceYou API')
//     .setDescription('Mediation platform connecting journalists and media companies worldwide')
//     .setVersion('1.0')
//     .addBearerAuth()
//     .build();
//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup('api', app, document);

//   const port = process.env.PORT || 3001;
//   await app.listen(port);
//   console.log(`Application is running on: http://localhost:${port}`);
//   console.log(`Swagger documentation: http://localhost:${port}/api`);
//   console.log('CORS enabled for:', [
//     'http://localhost:3000',
//     'http://localhost:3001',
//     'http://127.0.0.1:3000',
//     'http://127.0.0.1:3001',
//     'http://localhost:3002',
//     'http://127.0.0.1:3002',
//   ]);
// }
// bootstrap();


import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication, ExpressAdapter } from '@nestjs/platform-express';
import { join } from 'path';
import express from 'express';

const server = express();

async function bootstrap() {
  // Set development mode if not already set
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
  }
  
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(server),
  );

  // Enable CORS with comprehensive configuration
  app.enableCors({
    origin: (origin, callback) => {
      console.log('CORS request from origin:', origin);
      
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        console.log('No origin provided, allowing request');
        return callback(null, true);
      }
      
      // For development, be more permissive
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode - allowing origin:', origin);
        return callback(null, true);
      }
      
      const allowedOrigins = [
        'https://wesourceyoub2.vercel.app',
        'https://wesourceyou-f.vercel.app',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
        'http://localhost:3002',
        'http://127.0.0.1:3002',
        'http://localhost:3003',
        'http://127.0.0.1:3003',
        'http://localhost:3004',
        'http://127.0.0.1:3004',
        'http://localhost:3005',
        'http://127.0.0.1:3005',
      ];
      
      if (allowedOrigins.includes(origin)) {
        console.log('Origin allowed:', origin);
        return callback(null, true);
      }
      
      // For development, allow any localhost origin
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        console.log('Localhost origin allowed:', origin);
        return callback(null, true);
      }
      
      console.log('Origin not allowed:', origin);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'Accept', 
      'X-Requested-With',
      'Origin',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers'
    ],
    exposedHeaders: ['Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Handle OPTIONS requests explicitly for Firefox compatibility
  app.use((req, res, next) => {
    // Log CORS requests for debugging
    if (req.method === 'OPTIONS') {
      console.log('CORS preflight request from:', req.headers.origin);
      console.log('Request headers:', req.headers);
    }
    
    if (req.method === 'OPTIONS') {
      const origin = req.headers.origin;
      const allowedOrigins = [
        'https://wesourceyoub2.vercel.app',
        'https://wesourceyou-f.vercel.app',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
        'http://localhost:3002',
        'http://127.0.0.1:3002',
        'http://localhost:3003',
        'http://127.0.0.1:3003',
        'http://localhost:3004',
        'http://127.0.0.1:3004',
        'http://localhost:3005',
        'http://127.0.0.1:3005',
      ];
      
      if (origin && (allowedOrigins.includes(origin) || origin.includes('localhost') || origin.includes('127.0.0.1'))) {
        res.header('Access-Control-Allow-Origin', origin);
      } else {
        res.header('Access-Control-Allow-Origin', '*');
      }
      
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Max-Age', '86400'); // 24 hours
      res.header('Access-Control-Expose-Headers', 'Authorization');
      return res.status(204).end();
    }
    next();
  });

  // Add CORS headers to all responses
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    
    // For development, be more permissive
    if (process.env.NODE_ENV === 'development') {
      res.header('Access-Control-Allow-Origin', origin || '*');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With, Origin');
      res.header('Access-Control-Expose-Headers', 'Authorization');
      return next();
    }
    
    const allowedOrigins = [
      'https://wesourceyoub2.vercel.app',
      'https://wesourceyou-f.vercel.app',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://localhost:3002',
      'http://127.0.0.1:3002',
      'http://localhost:3003',
      'http://127.0.0.1:3003',
      'http://localhost:3004',
      'http://127.0.0.1:3004',
      'http://localhost:3005',
      'http://127.0.0.1:3005',
    ];
    
    if (origin && (allowedOrigins.includes(origin) || origin.includes('localhost') || origin.includes('127.0.0.1'))) {
      res.header('Access-Control-Allow-Origin', origin);
    } else if (origin) {
      res.header('Access-Control-Allow-Origin', origin);
    }
    
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With, Origin');
    res.header('Access-Control-Expose-Headers', 'Authorization');
    next();
  });

  // Add a simple CORS test endpoint
  app.use('/cors-test', (req, res) => {
    res.json({
      message: 'CORS test successful',
      origin: req.headers.origin,
      method: req.method,
      headers: req.headers,
      timestamp: new Date().toISOString()
    });
  });

  // Pipes & Middleware
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));

  app.use((error, req, res, next) => {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 100MB.', error: 'FILE_TOO_LARGE' });
    }
    if (error.message === 'Invalid file type') {
      return res.status(400).json({ message: 'Invalid file type. Please upload a supported file format.', error: 'INVALID_FILE_TYPE' });
    }
    next(error);
  });

  // Static assets (⚠️ won't persist on Vercel, consider S3 instead)
  const uploadPath = process.env.UPLOAD_PATH || 'uploads';
  app.useStaticAssets(join(__dirname, '..', uploadPath), { prefix: `/${uploadPath}/` });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('WeSourceYou API')
    .setDescription('Mediation platform connecting journalists and media companies worldwide')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.init();
  
  // Log CORS configuration
  console.log('CORS Configuration:');
  console.log('- Development mode:', process.env.NODE_ENV === 'development');
  console.log('- Allowed origins for development: * (any origin)');
  console.log('- Production origins: specific domains only');
  
  return server;
}

export default bootstrap();
