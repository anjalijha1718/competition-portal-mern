import { z } from 'zod';
import mongoose from 'mongoose';

const objectIdValidator = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId format',
});

export const competitionSlugSchema = z.object({
  params: z.object({
    slug: z.string().min(1, 'Slug is required'),
  }),
});

export const competitionIdSchema = z.object({
  params: z.object({
    id: objectIdValidator,
  }),
});

export const submissionSchema = z.object({
  params: z.object({
    id: objectIdValidator,
  }),
  body: z.object({
    submissionUrl: z
      .string()
      .url('Please provide a valid URL (YouTube, Drive, Vimeo, or video link)')
      .min(5, 'URL must not be empty'),
  }),
});
