import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import apiRouter from './routes';
import { errorHandler } from './middleware/errorHandler';
import { ApiError } from './utils/ApiError';

const app = express();

// Configure trust proxy for reverse proxy environments (Render/Railway/Fly)
app.set('trust proxy', 1);

// Security & Parsing Middlewares
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// Health Check Route
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    message: 'ByteCraft Backend API is healthy',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api', apiRouter);

// 404 Handler
app.use('*', (_req: Request, _res: Response, next: NextFunction) => {
  next(ApiError.notFound('Requested API endpoint does not exist.'));
});

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
