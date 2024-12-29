import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import WebApp from '@twa-dev/sdk';
import { validate3rd } from '@telegram-apps/init-data-node/web';

interface AuthContextType {
  user: any;
  loading: boolean;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  telegramUser: {
    userID: number | null;
    username: string | null;
    windowHeight: number;
    isDataValid: boolean;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const [telegramUser, setTelegramUser] = useState({
    userID: null as number | null,
    username: null as string | null,
    windowHeight: 0,
    isDataValid: false
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && WebApp) {
      WebApp.isVerticalSwipesEnabled = false;
      setTelegramUser(prev => ({
        ...prev,
        windowHeight: WebApp.viewportStableHeight || window.innerHeight
      }));
      WebApp.ready();

      (async () => {
        try {
          const botId = 7836566125; // Your bot ID from the message
          await validate3rd(WebApp.initData, botId);
          const user = WebApp.initDataUnsafe.user;
          setTelegramUser(prev => ({
            ...prev,
            isDataValid: true,
            userID: user?.id || null,
            username: user?.username || null
          }));
        } catch (error) {
          console.error('Telegram validation failed:', error);
          setTelegramUser(prev => ({
            ...prev,
            isDataValid: false
          }));
        }
      })();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, telegramUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};