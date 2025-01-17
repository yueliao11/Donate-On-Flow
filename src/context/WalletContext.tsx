import React, { createContext, useContext, useState, useEffect } from 'react';
import * as fcl from '@onflow/fcl';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

interface WalletContextValue {
  connected: boolean;
  walletAddress: string | null;
  chainId: string | null;
  connecting: boolean;
  error: Error | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount();
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 同步wagmi状态
  useEffect(() => {
    if (isConnected && address) {
      // 存储到localStorage
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletAddress', address);
    } else {
      localStorage.removeItem('walletConnected');
      localStorage.removeItem('walletAddress');
    }
  }, [isConnected, address]);

  return (
    <WalletContext.Provider
      value={{
        connected: isConnected,
        walletAddress: address ?? null,
        chainId: null,
        connecting,
        error,
        connect: async () => {
          setConnecting(true);
          try {
            // 连接钱包逻辑
          } catch (err) {
            setError(err as Error);
          } finally {
            setConnecting(false);
          }
        },
        disconnect: async () => {
          // 断开连接逻辑
        }
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
