import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  const requiredProductionEnvs = [
    'JWT_SECRET',
    'ADMIN_EMAIL',
    'ADMIN_PASSWORD',
  ];

  for (const envVar of requiredProductionEnvs) {
    if (!process.env[envVar] || process.env[envVar]?.trim() === '') {
      throw new Error(`Missing required production environment variable: ${envVar}`);
    }
  }
}

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGODB_URI: process.env.MONGODB_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || (isProduction ? '' : 'default_dev_secret_key_12345'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || (isProduction ? '' : 'admin@bytecraft.dev'),
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || (isProduction ? '' : 'AdminPass123!'),
};

if (!env.MONGODB_URI) {
  console.warn('[WARNING]: MONGODB_URI is not defined in environment variables.');
}
