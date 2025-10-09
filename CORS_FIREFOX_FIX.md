# CORS Firefox Compatibility Fix

## Problem
Login works in Chrome but fails in Firefox with CORS errors. Firefox is more strict about CORS policies compared to Chrome.

## Root Cause
Firefox has stricter CORS enforcement and requires:
1. Proper preflight OPTIONS request handling
2. Correct CORS headers on all responses
3. Specific header configurations for credentials

## Solution Applied

### 1. Enhanced CORS Configuration
Updated `src/main.ts` with comprehensive CORS settings:

```typescript
app.enableCors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://wesourceyoub2.vercel.app',
      'https://wesourceyou-f.vercel.app',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://localhost:3002',
      'http://127.0.0.1:3002',
    ];
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // For development, allow any localhost origin
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
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
```

### 2. Explicit OPTIONS Request Handling
Added middleware to handle OPTIONS requests explicitly:

```typescript
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    // Log for debugging
    console.log('CORS preflight request from:', req.headers.origin);
    
    const origin = req.headers.origin;
    const allowedOrigins = [/* ... */];
    
    if (origin && (allowedOrigins.includes(origin) || origin.includes('localhost'))) {
      res.header('Access-Control-Allow-Origin', origin);
    } else {
      res.header('Access-Control-Allow-Origin', '*');
    }
    
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400');
    res.header('Access-Control-Expose-Headers', 'Authorization');
    return res.status(204).end();
  }
  next();
});
```

### 3. CORS Headers on All Responses
Added middleware to ensure CORS headers are present on all responses:

```typescript
app.use((req, res, next) => {
  const origin = req.headers.origin;
  // ... origin validation logic ...
  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With, Origin');
  res.header('Access-Control-Expose-Headers', 'Authorization');
  next();
});
```

## Testing

### 1. Deploy the Backend
Make sure to deploy the updated backend to Vercel.

### 2. Test in Firefox
1. Open Firefox Developer Tools (F12)
2. Go to Network tab
3. Try to login
4. Check the OPTIONS request to `/auth/login`
5. Verify it returns status 204 with proper CORS headers

### 3. Check Console Logs
The backend will now log CORS preflight requests, which helps with debugging.

## Additional Debugging

If issues persist:

1. **Check Firefox Console**: Look for CORS-related errors
2. **Network Tab**: Verify OPTIONS request returns 204 status
3. **Backend Logs**: Check Vercel function logs for CORS request logs
4. **Headers**: Ensure all required headers are present

## Firefox-Specific Considerations

Firefox is stricter about:
- Credentials with wildcard origins (`*`)
- Preflight request handling
- Header case sensitivity
- Timing of CORS header application

## Production Considerations

For production, consider:
1. Using environment variables for allowed origins
2. Implementing more sophisticated origin validation
3. Adding rate limiting for CORS requests
4. Monitoring CORS-related errors

## Alternative Solutions

If the above doesn't work, consider:
1. Using a CORS proxy for development
2. Implementing server-side session management
3. Using SameSite cookie attributes
4. Implementing JWT with httpOnly cookies
