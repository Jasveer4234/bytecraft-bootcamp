import { Schema, model, Document } from 'mongoose';

export interface IScheduleItem extends Document {
  title: string;
  dayOrDate: string;
  description: string;
  speaker: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const scheduleItemSchema = new Schema<IScheduleItem>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    dayOrDate: {
      type: String,
      required: [true, 'Day or date is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    speaker: {
      type: String,
      required: [true, 'Speaker is required'],
      trim: true,
    },
    order: {
      type: Number,
      required: [true, 'Order is required'],
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, any>) {
        if (ret._id) {
          ret.id = ret._id.toString();
          delete ret._id;
        }
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const ScheduleItem = model<IScheduleItem>('ScheduleItem', scheduleItemSchema);
