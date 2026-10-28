import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env or root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

export let isDbConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/voraeclat';
  try {
    mongoose.set('bufferCommands', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000
    });
    isDbConnected = true;
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    isDbConnected = false;
    console.warn(`[MongoDB Notice]: Database connection failed (${error.message}).`);
    console.warn(`Backend is active in In-Memory/Offline-tolerant mode. All API routes remain responsive.`);
  }
};
