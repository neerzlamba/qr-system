import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">QR Code Manager</h1>
            <p className="text-sm text-gray-600">Generate and manage your QR codes</p>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.email}</p>
                  <p className="text-xs text-gray-500">
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
