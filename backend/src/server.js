import app from './app.js';
import { connectDB } from './config/db.js';
import { ENV } from './config/env.js';

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  const server = app.listen(ENV.PORT, () => {
    console.log(`===============================================`);
    console.log(`🚀 Feedants Backend running on port ${ENV.PORT}`);
    console.log(`🌐 Environment: ${ENV.NODE_ENV}`);
    console.log(`🔗 API Base URL: http://localhost:${ENV.PORT}/api/v1`);
    console.log(`===============================================`);
  });

  // Handle graceful shutdowns
  const handleShutdown = (signal) => {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
};

startServer().catch((err) => {
  console.error('Fatal server boot error:', err);
  process.exit(1);
});
