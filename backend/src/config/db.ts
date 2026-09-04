import mongoose from 'mongoose';
import { env } from './env';

export const connectDB = async (): Promise<typeof mongoose> => {
  if (!env.MONGODB_URI) {
    console.error('[FATAL]: MONGODB_URI environment variable is missing.');
    throw new Error('Database configuration error: MONGODB_URI is required.');
  }

  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    console.log(`[Database]: Connected successfully to host: ${conn.connection.host}`);
    return conn;
  } catch (error: any) {
    console.error(`[Database Error]: Failed to connect to MongoDB — ${error.message || 'Unknown database error'}`);
    throw error;
  }
};
