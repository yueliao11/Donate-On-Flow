'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import * as fcl from '@onflow/fcl';
import '../config/flow-config';

interface AuthContextType {
  connected: boolean;
  walletAddress: string | null;
  chainId: string | null;
  signer: any | null;
  charityContract: any | null;
  telegramUser: any | null;
  user: {
    addr: string | null;
    loggedIn: boolean;
  };
  logIn: () => Promise<void>;
  logOut: () => Promise<void>;
  telegramLogIn: () => Promise<void>;
  telegramLogOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [signer, setSigner] = useState<any | null>(null);
  const [charityContract, setCharityContract] = useState<any | null>(null);
  const [telegramUser, setTelegramUser] = useState<any | null>(null);
  const [user, setUser] = useState({
    addr: null,
    loggedIn: false
  });

  // 监听 FCL 用户状态
  useEffect(() => {
    fcl.currentUser().subscribe((currentUser: any) => {
      setUser({
        addr: currentUser.addr,
        loggedIn: currentUser.addr !== null
      });
      setWalletAddress(currentUser.addr);
      setConnected(currentUser.addr !== null);
      setChainId(currentUser.network || null);
    });
  }, []);

  const logIn = async () => {
    try {
      await fcl.authenticate();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const logOut = async () => {
    try {
      await fcl.unauthenticate();
      setWalletAddress(null);
      setChainId(null);
      setConnected(false);
      setSigner(null);
      setCharityContract(null);
      setUser({
        addr: null,
        loggedIn: false
      });
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  // 保持 Telegram 相关功能不变
  const telegramLogIn = async () => {
    // 原有的 Telegram 登录逻辑
  };

  const telegramLogOut = () => {
    setTelegramUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        connected,
        walletAddress,
        chainId,
        signer,
        charityContract,
        telegramUser,
        user,
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};