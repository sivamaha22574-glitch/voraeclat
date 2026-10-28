import mongoose from 'mongoose';

export let isDbConnected = false;

export const connectDB = async () => {
  try {
    mongoose.set('bufferCommands', false);
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/voraeclat', {
      serverSelectionTimeoutMS: 2500
    });
    isDbConnected = true;
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
  } catch (error) {
    isDbConnected = false;
    console.warn(`[MongoDB Notice]: Local MongoDB not detected (${error.message}).`);
    console.warn(`Backend is active in In-Memory/Offline-tolerant mode. All API routes remain responsive.`);
  }
};
