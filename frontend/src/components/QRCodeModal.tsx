import React, { useState } from 'react';
import { QRCode, UpdateQRCodeRequest } from '../types';
import { useAuth } from '../context/AuthContext';
import { qrCodeAPI } from '../services/api';

interface QRCodeModalProps {
  qrCode: QRCode;
  onClose: () => void;
  onUpdate: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ qrCode, onClose, onUpdate }) => {
  const { token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateQRCodeRequest>({
    name: qrCode.name,
    description: qrCode.description || '',
    content: qrCode.content,
    size: qrCode.size,
    errorCorrectionLevel: qrCode.errorCorrectionLevel as 'L' | 'M' | 'Q' | 'H',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'size' ? parseInt(value) : value,
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) return;

    setLoading(true);
    setError('');

    try {
      await qrCodeAPI.update(token, qrCode.id, formData);
      onUpdate();
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCode.imageData;
    link.download = `${qrCode.name}.${qrCode.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              {isEditing ? 'Edit QR Code' : 'QR Code Details'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {!isEditing ? (
            <div className="space-y-4">
              <div className="flex justify-center bg-gray-50 p-6 rounded-lg">
                {qrCode.format === 'svg' ? (
                  <div dangerouslySetInnerHTML={{ __html: qrCode.imageData }} />
                ) : (
                  <img
                    src={qrCode.imageData}
                    alt={qrCode.name}
                    className="max-w-full"
                  />
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="font-semibold text-gray-700">Name:</label>
                  <p className="text-gray-900">{qrCode.name}</p>
                </div>

                {qrCode.description && (
                  <div>
                    <label className="font-semibold text-gray-700">Description:</label>
                    <p className="text-gray-900">{qrCode.description}</p>
                  </div>
                )}

                <div>
                  <label className="font-semibold text-gray-700">Content:</label>
                  <p className="text-gray-900 break-all">{qrCode.content}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-gray-700">Format:</label>
                    <p className="text-gray-900">{qrCode.format.toUpperCase()}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700">Size:</label>
                    <p className="text-gray-900">{qrCode.size}px</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700">Error Correction:</label>
                    <p className="text-gray-900">{qrCode.errorCorrectionLevel}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700">Created:</label>
                    <p className="text-gray-900">
                      {new Date(qrCode.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Edit
                </button>
                <button
                  onClick={handleDownload}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Download
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Content *
                </label>
                <textarea
                  id="content"
                  name="content"
                  required
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
                  value={formData.content}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                    Size (px)
                  </label>
                  <input
                    type="number"
                    id="size"
                    name="size"
                    min="100"
                    max="1000"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
                    value={formData.size}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="errorCorrectionLevel" className="block text-sm font-medium text-gray-700">
                    Error Correction
                  </label>
                  <select
                    id="errorCorrectionLevel"
                    name="errorCorrectionLevel"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
                    value={formData.errorCorrectionLevel}
                    onChange={handleInputChange}
                  >
                    <option value="L">Low (L)</option>
                    <option value="M">Medium (M)</option>
                    <option value="Q">Quartile (Q)</option>
                    <option value="H">High (H)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400"
                >
                  {loading ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
