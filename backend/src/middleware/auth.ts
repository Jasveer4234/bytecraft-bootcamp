import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { verifyToken } from '../utils/jwt';
import { ApiError } from '../utils/ApiError';

export const requireAuth = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return next(ApiError.unauthorized('Authentication token is missing. Please log in.'));
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return next(ApiError.unauthorized('Invalid or expired authentication token.'));
  }
};

export const requireRole = (role: 'admin') => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required.'));
    }

    if (req.user.role !== role) {
      return next(ApiError.forbidden(`Access denied: Requires ${role} role permissions.`));
    }

    next();
  };
};

export const requireAdmin = requireRole('admin');
