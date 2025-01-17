import { createContext, useContext } from 'react';
import { usePrivy } from '@privy-io/react-auth';

interface WalletContextType {
  account: string | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType>({} as WalletContextType);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { authenticated, login, logout, user } = usePrivy();

  const value = {
    account: user?.wallet?.address || null,
    isConnected: authenticated,
    connect: login,
    disconnect: logout
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
