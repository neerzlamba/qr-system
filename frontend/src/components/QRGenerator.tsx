import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { qrCodeAPI } from '../services/api';
import { CreateQRCodeRequest } from '../types';

interface QRGeneratorProps {
  onQRCodeCreated: () => void;
}

export const QRGenerator: React.FC<QRGeneratorProps> = ({ onQRCodeCreated }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState<CreateQRCodeRequest>({
    content: '',
    name: '',
    description: '',
    size: 300,
    errorCorrectionLevel: 'M',
    format: 'png',
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'size' ? parseInt(value) : value,
    }));
  };

  const handlePreview = async () => {
    if (!formData.content) {
      setError('Content is required for preview');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const result = await qrCodeAPI.preview(
        formData.content,
        formData.size,
        formData.errorCorrectionLevel,
        formData.format
      );
      setPreview(result.imageData);
    } catch (err: any) {
      setError(err.message || 'Failed to generate preview');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('You must be logged in');
      return;
    }

    setLoading(true);

    try {
      await qrCodeAPI.create(token, formData);
      setSuccess('QR Code created successfully!');
      setFormData({
        content: '',
        name: '',
        description: '',
        size: 300,
        errorCorrectionLevel: 'M',
        format: 'png',
      });
      setPreview(null);
      onQRCodeCreated();
    } catch (err: any) {
      setError(err.message || 'Failed to create QR Code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Generate New QR Code</h2>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
            Content (URL or Text) *
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <div>
            <label htmlFor="format" className="block text-sm font-medium text-gray-700">
              Format
            </label>
            <select
              id="format"
              name="format"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
              value={formData.format}
              onChange={handleInputChange}
            >
              <option value="png">PNG</option>
              <option value="svg">SVG</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={handlePreview}
            disabled={loading || !formData.content}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-200"
          >
            Preview
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
          >
            {loading ? 'Processing...' : 'Create QR Code'}
          </button>
        </div>
      </form>

      {preview && (
        <div className="mt-6 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Preview</h3>
          <div className="flex justify-center">
            {formData.format === 'svg' ? (
              <div dangerouslySetInnerHTML={{ __html: preview }} />
            ) : (
              <img src={preview} alt="QR Code Preview" className="max-w-full" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
