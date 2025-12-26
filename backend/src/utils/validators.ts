import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const createQRCodeSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  size: z.number().min(100).max(1000).optional().default(300),
  errorCorrectionLevel: z.enum(['L', 'M', 'Q', 'H']).optional().default('M'),
  format: z.enum(['png', 'svg']).optional().default('png'),
});

export const updateQRCodeSchema = z.object({
  content: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  size: z.number().min(100).max(1000).optional(),
  errorCorrectionLevel: z.enum(['L', 'M', 'Q', 'H']).optional(),
});
