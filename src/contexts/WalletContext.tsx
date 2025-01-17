import { createContext, useContext, useState, useEffect } from 'react';
import { OKXUniversalConnectUI } from '@okxconnect/ui';
import * as fcl from '@onflow/fcl';
import { OKX_CONFIG } from '../config/okx';
import { usePrivy } from '@privy-io/react-auth';

interface WalletContextType {
  loggedIn: boolean;
  walletAddress: string | null;
  chainId: string | null;
  connectWallet: (type: 'okx' | 'fcl' | 'privy') => Promise<void>;
  disconnectWallet: () => Promise<void>;
  isTelegramUser: boolean;
}

export const WalletContext = createContext<WalletContextType>({} as WalletContextType);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authenticated, user } = usePrivy();
  const [okxClient, setOkxClient] = useState<OKXUniversalConnectUI | null>(null);
  const [walletType, setWalletType] = useState<'okx' | 'fcl' | 'privy' | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isTelegramUser, setIsTelegramUser] = useState(false);

  const initOKXClient = async () => {
    const client = new OKXUniversalConnectUI(OKX_CONFIG);
    setOkxClient(client);
  };

  const connectWallet = async (type: 'okx' | 'fcl' | 'privy') => {
    setWalletType(type);
    try {
      if (type === 'privy') {
        // Privy钱包已经在useEffect中处理
        return;
      }
      switch (type) {
        case 'okx':
          await connectOKX();
          break;
        case 'fcl':
          await connectFCL();
          break;
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setLoggedIn(false);
      setWalletAddress(null);
    }
  };

  const disconnectWallet = async () => {
    if (walletType === 'fcl') {
      await fcl.unauthenticate();
    } else if (walletType === 'okx' && okxClient) {
      await okxClient.disconnect();
    }
    setLoggedIn(false);
    setWalletAddress(null);
    setChainId(null);
    setWalletType(null);
  };

  const connectOKX = async () => {
    if (!okxClient) return;
    const result = await okxClient.connect();
    setWalletAddress(result.address);
    setChainId(result.chainId);
    setLoggedIn(true);
  };

  const connectFCL = async () => {
    await fcl.authenticate();
    const user = await fcl.currentUser().snapshot();
    setWalletAddress(user.addr);
    setChainId(user.network || null);
    setLoggedIn(true);
  };

  useEffect(() => {
    initOKXClient();
  }, []);

  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      setLoggedIn(true);
      setWalletAddress(user.wallet.address);
    } else {
      setLoggedIn(false);
      setWalletAddress(null);
    }
  }, [authenticated, user]);

  return (
    <WalletContext.Provider value={{
      loggedIn,
      walletAddress,
      chainId,
      connectWallet,
      disconnectWallet,
      isTelegramUser
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
