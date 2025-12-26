export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface QRCode {
  id: string;
  userId: string;
  content: string;
  name: string;
  description?: string;
  imageData: string;
  format: string;
  size: number;
  errorCorrectionLevel: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
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
