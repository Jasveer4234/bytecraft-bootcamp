import mongoose from 'mongoose';
import { ApiError } from './ApiError';

export const validateObjectId = (id: string, paramName = 'ID'): void => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest(`Invalid MongoDB ${paramName} format.`);
  }
};
