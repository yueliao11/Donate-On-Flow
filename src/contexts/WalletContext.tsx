import React, { createContext, useContext, useState, useEffect } from 'react';
import { OKXUniversalConnectUI } from '@okxconnect/ui';
import * as fcl from '@onflow/fcl';
import { OKX_CONFIG } from '../config/okx';

interface WalletContextType {
  connected: boolean;
  walletAddress: string | null;
  chainId: string | null;
  connectWallet: (type: 'okx' | 'fcl') => Promise<void>;
  disconnectWallet: () => Promise<void>;
  isTelegramUser: boolean;
}

export const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [okxClient, setOkxClient] = useState<OKXUniversalConnectUI | null>(null);
  const [walletType, setWalletType] = useState<'okx' | 'fcl' | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [isTelegramUser, setIsTelegramUser] = useState(false);

  // 检测是否是Telegram用户
  useEffect(() => {
    const isTg = window.Telegram?.WebApp != null;
    setIsTelegramUser(isTg);
  }, []);

  // 初始化OKX客户端
  useEffect(() => {
    const initOKXClient = async () => {
      try {
        const uiClient = await OKXUniversalConnectUI.init(OKX_CONFIG);
        setOkxClient(uiClient);
      } catch (error) {
        console.error('Failed to initialize OKX UI:', error);
      }
    };

    if (isTelegramUser) {
      initOKXClient();
    }
  }, [isTelegramUser]);

  // 连接OKX钱包
  const connectOKX = async () => {
    if (!okxClient) return;
    try {
      const session = await okxClient.openModal({
        namespaces: {
          flow: {
            chains: ['flow:747'],
            defaultChain: '747',
          },
        },
      });

      if (!session || !session.namespaces.flow) {
        console.error('Session is undefined or invalid');
        return;
      }

      const address = session.namespaces.flow.accounts[0]?.split(':')[2];
      const chain = session.namespaces.flow.chains[0]?.split(':')[1] || null;

      setWalletAddress(address);
      setChainId(chain);
      setConnected(true);
    } catch (error) {
      console.error('Failed to connect OKX wallet:', error);
    }
  };

  // 连接FCL钱包
  const connectFCL = async () => {
    try {
      const user = await fcl.authenticate();
      setWalletAddress(user.addr);
      setConnected(true);
    } catch (error) {
      console.error('Failed to connect FCL wallet:', error);
    }
  };

  // 连接钱包
  const connectWallet = async (type: 'okx' | 'fcl') => {
    setWalletType(type);
    if (type === 'okx') {
      await connectOKX();
    } else {
      await connectFCL();
    }
  };

  // 断开钱包连接
  const disconnectWallet = async () => {
    try {
      if (walletType === 'okx' && okxClient) {
        await okxClient.disconnect();
      } else {
        await fcl.unauthenticate();
      }
      setWalletAddress(null);
      setChainId(null);
      setConnected(false);
      setWalletType(null);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        connected,
        walletAddress,
        chainId,
        connectWallet,
        disconnectWallet,
        isTelegramUser,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
