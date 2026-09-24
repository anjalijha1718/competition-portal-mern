import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { ENV } from './config/env.js';
import { globalLimiter } from './middlewares/rateLimit.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

import authRoutes from './routes/auth.routes.js';
import competitionRoutes from './routes/competition.routes.js';
import referralRoutes from './routes/referral.routes.js';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: [ENV.CORS_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

// Logging
if (ENV.NODE_ENV !== 'test') {
  app.use(morgan(ENV.NODE_ENV === 'development' ? 'dev' : 'combined'));
}

// Body parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Global rate limiting
app.use('/api', globalLimiter);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Feedants API is running healthy',
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: ENV.NODE_ENV,
    },
  });
});

// Mount Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/competitions', competitionRoutes);
app.use('/api/v1/referrals', referralRoutes);

// Catch 404
app.use(notFoundHandler);

// Centralized error handling
app.use(errorHandler);

export default app;
