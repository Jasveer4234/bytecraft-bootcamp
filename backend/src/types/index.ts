import { Request } from 'express';

export interface JwtPayload {
  userId: string;
  email: string;
  role: 'admin' | 'user';
}

export interface UserPayload {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
