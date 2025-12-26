import { Request } from 'express';

export interface AuthRequest extends Request {
  userId?: string;
}

export interface UserPayload {
  userId: string;
  email: string;
}

export interface CreateQRCodeRequest {
  content: string;
  name: string;
  description?: string;
  size?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  format?: 'png' | 'svg';
}

export interface UpdateQRCodeRequest {
  content?: string;
  name?: string;
  description?: string;
  size?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
