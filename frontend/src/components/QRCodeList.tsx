import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { qrCodeAPI } from '../services/api';
import { QRCode } from '../types';
import { QRCodeItem } from './QRCodeItem';

interface QRCodeListProps {
  refreshTrigger: number;
}

export const QRCodeList: React.FC<QRCodeListProps> = ({ refreshTrigger }) => {
  const { token } = useAuth();
  const [qrCodes, setQRCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchQRCodes = async () => {
    if (!token) return;

    setLoading(true);
    setError('');

    try {
      const codes = await qrCodeAPI.getAll(token);
      setQRCodes(codes);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch QR codes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQRCodes();
  }, [token, refreshTrigger]);

  const handleDelete = async (id: string) => {
    if (!token) return;

    if (!confirm('Are you sure you want to delete this QR code?')) {
      return;
    }

    try {
      await qrCodeAPI.delete(token, id);
      setQRCodes((prev) => prev.filter((qr) => qr.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete QR code');
    }
  };

  const handleUpdate = () => {
    fetchQRCodes();
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-center items-center h-32">
          <div className="text-gray-500">Loading QR codes...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">My QR Codes</h2>

      {qrCodes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No QR codes yet. Create your first one above!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrCodes.map((qrCode) => (
            <QRCodeItem
              key={qrCode.id}
              qrCode={qrCode}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};
