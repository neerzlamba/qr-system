import React, { useState } from 'react';
import { QRCode } from '../types';
import { QRCodeModal } from './QRCodeModal';

interface QRCodeItemProps {
  qrCode: QRCode;
  onDelete: (id: string) => void;
  onUpdate: () => void;
}

export const QRCodeItem: React.FC<QRCodeItemProps> = ({ qrCode, onDelete, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCode.imageData;
    link.download = `${qrCode.name}.${qrCode.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyData = async () => {
    try {
      await navigator.clipboard.writeText(qrCode.content);
      alert('QR code content copied to clipboard!');
    } catch (err) {
      alert('Failed to copy to clipboard');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
        <div className="flex justify-center mb-4 bg-gray-50 p-4 rounded">
          {qrCode.format === 'svg' ? (
            <div
              dangerouslySetInnerHTML={{ __html: qrCode.imageData }}
              className="w-32 h-32"
            />
          ) : (
            <img
              src={qrCode.imageData}
              alt={qrCode.name}
              className="w-32 h-32 object-contain"
            />
          )}
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-lg truncate">{qrCode.name}</h3>
          {qrCode.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{qrCode.description}</p>
          )}
          <div className="text-xs text-gray-500">
            <p>Format: {qrCode.format.toUpperCase()}</p>
            <p>Size: {qrCode.size}px</p>
            <p>Created: {formatDate(qrCode.createdAt)}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="px-3 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            View
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
          >
            Download
          </button>
          <button
            onClick={handleCopyData}
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Copy Data
          </button>
          <button
            onClick={() => onDelete(qrCode.id)}
            className="px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      {showModal && (
        <QRCodeModal
          qrCode={qrCode}
          onClose={() => setShowModal(false)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
};
