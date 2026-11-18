import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';
import { seedDatabase } from './utils/seed.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();

    const server = app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`  🚀 Implex Edu Backend API Server Running    `);
      console.log(`  📡 Port: ${PORT}                             `);
      console.log(`  🌍 Mode: ${process.env.NODE_ENV || 'development'} `);
      console.log(`  🔗 Health: http://localhost:${PORT}/api/health `);
      console.log(`===============================================`);
    });

    // Handle Unhandled Promise Rejections
    process.on('unhandledRejection', (err) => {
      console.error(`[Fatal] Unhandled Rejection: ${err.message}`);
      // Close server & exit
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error(`[Fatal] Server initialization failure: ${error.message}`);
    process.exit(1);
  }
};

startServer();
