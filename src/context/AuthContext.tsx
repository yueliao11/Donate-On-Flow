'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { OKXUniversalConnectUI, THEME } from '@okxconnect/ui';
import { ethers } from 'ethers';
import { CharityProject__factory } from '../types/factories/CharityProject__factory';

interface AuthContextType {
  connected: boolean;
  walletAddress: string | null;
  chainId: string | null;
  signer: ethers.Signer | null;
  charityContract: ethers.Contract | null;
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
  const [client, setClient] = useState<OKXUniversalConnectUI | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [charityContract, setCharityContract] = useState<ethers.Contract | null>(null);
  const [telegramUser, setTelegramUser] = useState<any | null>(null);
  const [user, setUser] = useState({
    addr: null,
    loggedIn: false
  });

  useEffect(() => {
    const initClient = async () => {
      try {
        const uiClient = await OKXUniversalConnectUI.init({
          dappMetaData: {
            name: 'Charity DApp',
            icon: 'https://your-icon-url.png',
          },
          actionsConfiguration: {
            returnStrategy: 'none',
            modals: 'all',
          },
          uiPreferences: {
            theme: THEME.LIGHT,
          },
        });
        setClient(uiClient);
      } catch (error) {
        console.error('Failed to initialize OKX UI:', error);
      }
    };
    initClient();
  }, []);

  useEffect(() => {
    if (connected && walletAddress) {
      setUser({
        addr: walletAddress,
        loggedIn: true
      });
    } else {
      setUser({
        addr: null,
        loggedIn: false
      });
    }
  }, [connected, walletAddress]);

  const logIn = async () => {
    if (!client) return;
    try {
      const session = await client.openModal({
        namespaces: {
          eip155: {
            chains: ['eip155:747'], // Flow EVM chain ID
            defaultChain: '747',
          },
        },
      });

      if (!session || !session.namespaces.eip155) {
        console.error('Session is undefined or invalid');
        return;
      }

      const address = session.namespaces.eip155.accounts[0]?.split(':')[2];
      const chain = session.namespaces.eip155.chains[0]?.split(':')[1] || null;

      // 创建 Web3Provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const newSigner = provider.getSigner();
      
      // 初始化合约
      const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
      if (!contractAddress) {
        throw new Error('Contract address not found in environment variables (VITE_CONTRACT_ADDRESS)');
      }
      const contract = CharityProject__factory.connect(contractAddress, newSigner);

      setWalletAddress(address);
      setChainId(chain);
      setConnected(true);
      setSigner(newSigner);
      setCharityContract(contract);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error; // 重新抛出错误以便上层组件处理
    }
  };

  const logOut = async () => {
    if (!client) return;
    try {
      await client.disconnect();
      setWalletAddress(null);
      setChainId(null);
      setConnected(false);
      setSigner(null);
      setCharityContract(null);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const telegramLogIn = async () => {
    // TODO: Implement Telegram login logic
  };

  const telegramLogOut = () => {
    // TODO: Implement Telegram logout logic
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