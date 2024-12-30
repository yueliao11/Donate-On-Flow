import React, { createContext, useContext, useState, useEffect } from 'react';
import * as fcl from '@onflow/fcl';
import WebApp from '@twa-dev/sdk';
import { validate3rd } from '@telegram-apps/init-data-node/web';

interface User {
  addr: string | null;
  loggedIn: boolean;
}

interface TelegramUser {
  id: number;
  first_name: string;
  username?: string;
}

interface AuthContextType {
  user: User | null;
  telegramUser: TelegramUser | null;
  logIn: () => Promise<void>;
  logOut: () => Promise<void>;
  telegramLogIn: () => Promise<void>;
  telegramLogOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    // Subscribe to user updates
    fcl.currentUser.subscribe(setUser);

    // Initialize FCL
    fcl.config()
      .put('app.detail.title', 'Flow Donate')
      .put('app.detail.icon', 'https://placekitten.com/g/200/200')
      .put('accessNode.api', 'https://rest-testnet.onflow.org')
      .put('flow.network', 'testnet')
      .put('discovery.wallet', 'https://fcl-discovery.onflow.org/testnet/authn')
      .put('0xFungibleToken', '0x9a0766d93b6608b7')
      .put('0xFUSD', '0xe223d8a629e49c68')
      .put('0xCharityProject', '0x945c254064cc292c35FA8516AFD415a73A0b23A0')
      .put('0xCharityProjectV2', '0x945c254064cc292c35FA8516AFD415a73A0b23A0');
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && WebApp) {
      WebApp.isVerticalSwipesEnabled = false;
      WebApp.ready();

      (async () => {
        try {
          const botId = 7836566125; // Your bot ID
          const initData = WebApp.initData;
          const isValid = validate3rd(initData, botId);

          if (isValid) {
            const user = WebApp.initDataUnsafe.user;
            if (user) {
              setTelegramUser({
                id: user.id,
                first_name: user.first_name,
                username: user.username
              });
            }
          }
        } catch (error) {
          console.error('Error validating Telegram user:', error);
        }
      })();
    }
  }, []);

  const logIn = async () => {
    try {
      const response = await fcl.authenticate();
      console.log('Authentication response:', response);
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const logOut = async () => {
    try {
      await fcl.unauthenticate();
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  const telegramLogIn = async () => {
    // Implement Telegram login logic
  };

  const telegramLogOut = async () => {
    setTelegramUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        telegramUser,
        logIn,
        logOut,
        telegramLogIn,
        telegramLogOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};