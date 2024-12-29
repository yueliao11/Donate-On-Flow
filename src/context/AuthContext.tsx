import React, { createContext, useContext, useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import { validate3rd } from '@telegram-apps/init-data-node/web';
import useFlowUser from '../hooks/useFlowUser';

interface AuthContextType {
  // Telegram Auth
  telegramUser: {
    userID: number | null;
    username: string | null;
    windowHeight: number;
    isDataValid: boolean;
  };
  // Flow Auth
  flowUser: any;
  flowLoggedIn: boolean;
  flowLogIn: () => void;
  flowLogOut: () => void;
  // Combined Auth State
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Telegram Auth State
  const [telegramUser, setTelegramUser] = useState({
    userID: null as number | null,
    username: null as string | null,
    windowHeight: 0,
    isDataValid: false
  });

  // Flow Auth State
  const { flowUser, flowLoggedIn, flowLogIn, flowLogOut } = useFlowUser();

  // Initialize Telegram Auth
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
          const botId = 7836566125; // Your bot ID
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

  // Combined authentication state
  const isAuthenticated = telegramUser.isDataValid || flowLoggedIn;

  const value = {
    telegramUser,
    flowUser,
    flowLoggedIn,
    flowLogIn,
    flowLogOut,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
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