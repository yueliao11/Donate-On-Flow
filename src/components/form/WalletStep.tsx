import React from 'react';
import { Wallet } from 'lucide-react';
import * as fcl from '@onflow/fcl';

interface WalletStepProps {
  onWalletConnected: (address: string) => void;
}

export const WalletStep: React.FC<WalletStepProps> = ({ onWalletConnected }) => {
  const [isConnecting, setIsConnecting] = React.useState(false);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      const user = await fcl.logIn();
      if (user.addr) {
        onWalletConnected(user.addr);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="text-center py-8">
      <Wallet className="w-16 h-16 mx-auto mb-4 text-blue-500" />
      <h3 className="text-lg font-medium mb-2">Connect Your Flow Wallet</h3>
      <p className="text-gray-600 mb-6">
        Connect your wallet to create and manage your charity project
      </p>
      <button
        onClick={connectWallet}
        disabled={isConnecting}
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>
    </div>
  );
};