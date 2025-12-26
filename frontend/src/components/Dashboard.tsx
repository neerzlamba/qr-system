import React, { useState } from 'react';
import { QRGenerator } from './QRGenerator';
import { QRCodeList } from './QRCodeList';
import { Header } from './Header';

export const Dashboard: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleQRCodeCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <QRGenerator onQRCodeCreated={handleQRCodeCreated} />
          <QRCodeList refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
};
