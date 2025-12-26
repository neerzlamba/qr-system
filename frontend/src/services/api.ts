import { AuthResponse, QRCode, CreateQRCodeRequest, UpdateQRCodeRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new APIError(response.status, errorData.error || 'Request failed');
  }
  return response.json();
};

export const authAPI = {
  register: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  getCurrentUser: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};

export const qrCodeAPI = {
  preview: async (
    content: string,
    size?: number,
    errorCorrectionLevel?: string,
    format?: string
  ) => {
    const response = await fetch(`${API_BASE_URL}/api/qrcodes/preview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, size, errorCorrectionLevel, format }),
    });
    return handleResponse(response);
  },

  create: async (token: string, data: CreateQRCodeRequest): Promise<QRCode> => {
    const response = await fetch(`${API_BASE_URL}/api/qrcodes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  getAll: async (token: string): Promise<QRCode[]> => {
    const response = await fetch(`${API_BASE_URL}/api/qrcodes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  getById: async (token: string, id: string): Promise<QRCode> => {
    const response = await fetch(`${API_BASE_URL}/api/qrcodes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  update: async (
    token: string,
    id: string,
    data: UpdateQRCodeRequest
  ): Promise<QRCode> => {
    const response = await fetch(`${API_BASE_URL}/api/qrcodes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (token: string, id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/qrcodes/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};
