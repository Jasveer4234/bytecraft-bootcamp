import { z } from 'zod';

export const createScheduleSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(1, 'Title cannot be empty'),
  dayOrDate: z
    .string({ required_error: 'Day/Date is required' })
    .trim()
    .min(1, 'Day/Date cannot be empty'),
  description: z
    .string({ required_error: 'Description is required' })
    .trim()
    .min(1, 'Description cannot be empty'),
  speaker: z
    .string({ required_error: 'Speaker is required' })
    .trim()
    .min(1, 'Speaker cannot be empty'),
  order: z
    .number({ required_error: 'Order is required' })
    .int('Order must be an integer')
    .min(0, 'Order must be non-negative'),
});

export const updateScheduleSchema = createScheduleSchema.partial();

export type CreateScheduleInput = z.infer<typeof createScheduleSchema>;
export type UpdateScheduleInput = z.infer<typeof updateScheduleSchema>;
