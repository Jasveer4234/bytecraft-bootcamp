import { Request, Response, NextFunction } from 'express';
import { ScheduleItem } from '../models/ScheduleItem';
import { ApiError } from '../utils/ApiError';
import { validateObjectId } from '../utils/validateObjectId';

export const getPublicSchedule = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const scheduleItems = await ScheduleItem.find().sort({ order: 1 });
    res.status(200).json({
      success: true,
      data: scheduleItems,
    });
  } catch (error) {
    next(error);
  }
};

export const createScheduleItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, dayOrDate, description, speaker, order } = req.body;

    const newItem = await ScheduleItem.create({
      title,
      dayOrDate,
      description,
      speaker,
      order,
    });

    res.status(201).json({
      success: true,
      message: 'Schedule item created successfully',
      data: newItem,
    });
  } catch (error) {
    next(error);
  }
};

export const updateScheduleItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    validateObjectId(id, 'Schedule Item ID');

    const updatedItem = await ScheduleItem.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return next(ApiError.notFound('Schedule item not found'));
    }

    res.status(200).json({
      success: true,
      message: 'Schedule item updated successfully',
      data: updatedItem,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteScheduleItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    validateObjectId(id, 'Schedule Item ID');

    const deletedItem = await ScheduleItem.findByIdAndDelete(id);
    if (!deletedItem) {
      return next(ApiError.notFound('Schedule item not found'));
    }

    res.status(200).json({
      success: true,
      message: 'Schedule item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
