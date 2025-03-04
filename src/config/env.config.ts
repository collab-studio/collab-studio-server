import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') }); // Load environment variables

const config = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || 'default_secret',
  refreshTokenSecret:
    process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret',
  mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/mydb',
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
  ],
  development: process.env.NODE_ENV === 'development',
  googleClientId: process.env.GOOGLE_CLIENT_ID || 'default_google_client_id',
  googleClientSecret:
    process.env.GOOGLE_CLIENT_SECRET || 'default_google_client_secret',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
};

export default config;
