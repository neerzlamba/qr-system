import { Request, Response } from 'express';
import { QRCodeService } from '../services/qrCodeService';
import { createQRCodeSchema, updateQRCodeSchema } from '../utils/validators';
import { AuthRequest } from '../types';

const qrCodeService = new QRCodeService();

export class QRCodeController {
  async createQRCode(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const validatedData = createQRCodeSchema.parse(req.body);
      const qrCode = await qrCodeService.createQRCode(req.userId, validatedData);

      res.status(201).json(qrCode);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getQRCodes(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const qrCodes = await qrCodeService.getQRCodesByUser(req.userId);
      res.status(200).json(qrCodes);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getQRCodeById(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      const qrCode = await qrCodeService.getQRCodeById(id, req.userId);

      res.status(200).json(qrCode);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'QR Code not found') {
          res.status(404).json({ error: error.message });
          return;
        }
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async updateQRCode(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      const validatedData = updateQRCodeSchema.parse(req.body);
      const qrCode = await qrCodeService.updateQRCode(
        id,
        req.userId,
        validatedData
      );

      res.status(200).json(qrCode);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'QR Code not found') {
          res.status(404).json({ error: error.message });
          return;
        }
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async deleteQRCode(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      const result = await qrCodeService.deleteQRCode(id, req.userId);

      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'QR Code not found') {
          res.status(404).json({ error: error.message });
          return;
        }
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async previewQRCode(req: Request, res: Response): Promise<void> {
    try {
      const { content, size, errorCorrectionLevel, format } = req.body;

      if (!content) {
        res.status(400).json({ error: 'Content is required' });
        return;
      }

      const preview = await qrCodeService.generateQRCodePreview(
        content,
        size,
        errorCorrectionLevel,
        format
      );

      res.status(200).json(preview);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
