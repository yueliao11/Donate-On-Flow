import React from 'react';
import { useAuth } from '../context/AuthContext';

export const TelegramUser: React.FC = () => {
  const { telegramUser, telegramLogIn, telegramLogOut } = useAuth();

  return (
    <div>
      {!telegramUser ? (
        <button
          onClick={telegramLogIn}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Connect Telegram
        </button>
      ) : (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {telegramUser.first_name}
          </span>
          <button
            onClick={telegramLogOut}
            className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};
