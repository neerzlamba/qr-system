import QRCode from 'qrcode';
import { PrismaClient } from '@prisma/client';
import { CreateQRCodeRequest, UpdateQRCodeRequest } from '../types';

const prisma = new PrismaClient();

export class QRCodeService {
  async createQRCode(userId: string, data: CreateQRCodeRequest) {
    const {
      content,
      name,
      description,
      size = 300,
      errorCorrectionLevel = 'M',
      format = 'png',
    } = data;

    let imageData: string;

    if (format === 'svg') {
      imageData = await QRCode.toString(content, {
        type: 'svg',
        width: size,
        errorCorrectionLevel,
      });
    } else {
      imageData = await QRCode.toDataURL(content, {
        width: size,
        errorCorrectionLevel,
      });
    }

    const qrCode = await prisma.qRCode.create({
      data: {
        userId,
        content,
        name,
        description,
        imageData,
        format,
        size,
        errorCorrectionLevel,
      },
    });

    return qrCode;
  }

  async getQRCodesByUser(userId: string) {
    const qrCodes = await prisma.qRCode.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return qrCodes;
  }

  async getQRCodeById(id: string, userId: string) {
    const qrCode = await prisma.qRCode.findFirst({
      where: { id, userId },
    });

    if (!qrCode) {
      throw new Error('QR Code not found');
    }

    return qrCode;
  }

  async updateQRCode(id: string, userId: string, data: UpdateQRCodeRequest) {
    const existingQRCode = await this.getQRCodeById(id, userId);

    const updateData: any = {
      ...data,
    };

    if (data.content || data.size || data.errorCorrectionLevel) {
      const content = data.content || existingQRCode.content;
      const size = data.size || existingQRCode.size;
      const errorCorrectionLevel =
        data.errorCorrectionLevel || existingQRCode.errorCorrectionLevel;
      const format = existingQRCode.format;

      let imageData: string;

      if (format === 'svg') {
        imageData = await QRCode.toString(content, {
          type: 'svg',
          width: size,
          errorCorrectionLevel: errorCorrectionLevel as 'L' | 'M' | 'Q' | 'H',
        });
      } else {
        imageData = await QRCode.toDataURL(content, {
          width: size,
          errorCorrectionLevel: errorCorrectionLevel as 'L' | 'M' | 'Q' | 'H',
        });
      }

      updateData.imageData = imageData;
      if (data.content) updateData.content = content;
      if (data.size) updateData.size = size;
      if (data.errorCorrectionLevel)
        updateData.errorCorrectionLevel = errorCorrectionLevel;
    }

    const qrCode = await prisma.qRCode.update({
      where: { id },
      data: updateData,
    });

    return qrCode;
  }

  async deleteQRCode(id: string, userId: string) {
    await this.getQRCodeById(id, userId);

    await prisma.qRCode.delete({
      where: { id },
    });

    return { message: 'QR Code deleted successfully' };
  }

  async generateQRCodePreview(
    content: string,
    size: number = 300,
    errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H' = 'M',
    format: 'png' | 'svg' = 'png'
  ) {
    let imageData: string;

    if (format === 'svg') {
      imageData = await QRCode.toString(content, {
        type: 'svg',
        width: size,
        errorCorrectionLevel,
      });
    } else {
      imageData = await QRCode.toDataURL(content, {
        width: size,
        errorCorrectionLevel,
      });
    }

    return { imageData, format };
  }
}
