import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from server directory and root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

let memoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/implex_edu';

  try {
    const isAtlas = uri.includes('mongodb+srv://') || uri.includes('mongodb.net');
    const timeout = isAtlas ? 15000 : 3000;

    console.log(`[Database] Connecting to MongoDB (${isAtlas ? 'Atlas Cloud Cluster' : 'Local URI'})...`);

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: timeout,
    });
    console.log(`[Database] MongoDB Connected successfully to host: ${conn.connection.host}`);
    return conn;
  } catch (primaryError) {
    console.warn(`[Database] Standard MongoDB connection not established (${primaryError.message}).`);

    // In development mode, if MongoDB is not running, switch to In-Memory Demo Mode
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[Database] 🚀 Activated In-Memory Demo Mode: API is 100% operational with seeded accounts & catalog!');
      console.warn('[Database] (To connect to persistent MongoDB: verify MONGODB_URI in server/.env)');
      global.__MOCK_MODE__ = true;
      mongoose.set('bufferCommands', false);
      return { isMock: true, connection: { host: 'in-memory-demo' } };
    } else {
      throw primaryError;
    }
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};
