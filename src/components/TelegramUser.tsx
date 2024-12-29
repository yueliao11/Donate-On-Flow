import React from 'react';
import { useAuthContext } from '../context/AuthContext';

export const TelegramUser: React.FC = () => {
  const { telegramUser } = useAuthContext();
  const { userID, username, windowHeight, isDataValid } = telegramUser;

  if (!isDataValid) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center space-y-4">
        <h1 className="text-xl font-bold text-red-600">
          Telegram Validation Failed
        </h1>
        <p>
          Please open this app through Telegram
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 text-center space-y-4">
      <h1 className="text-xl font-bold">
        Welcome to Flow Donate!
      </h1>
      <div className="space-y-2">
        <p>Telegram ID: {userID || 'Not available'}</p>
        <p>Username: {username || 'Not available'}</p>
        <p>Window Height: {windowHeight}px</p>
      </div>
    </div>
  );
};
