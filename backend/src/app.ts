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

// Helper to validate allowed origins
const isOriginAllowed = (origin?: string): boolean => {
  if (!origin) return true; // Allow non-browser, server-to-server, or same-origin requests
  if (env.ALLOWED_ORIGINS.includes(origin)) return true;

  // Allow strictly scoped Vercel preview/branch URLs for this project under the Jasveer4234 account
  const isVercelPreview = /^https:\/\/bytecraft-bootcamp(-[a-zA-Z0-9]+)*-(jasveer4234s-projects|jasveer4234)\.vercel\.app$/i.test(origin);
  if (isVercelPreview) return true;

  return false;
};

// Security & Parsing Middlewares
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy error: Origin ${origin} not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
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
