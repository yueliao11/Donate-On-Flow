import React from 'react';
import { useWallet } from '../../contexts/WalletContext';

export const LoginButton: React.FC = () => {
  const { connectWallet, isTelegramUser, connected, disconnectWallet } = useWallet();
  
  const handleClick = async () => {
    if (connected) {
      await disconnectWallet();
    } else {
      // 如果是Telegram用户，优先使用OKX钱包
      const walletType = isTelegramUser ? 'okx' : 'fcl';
      await connectWallet(walletType);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      {connected ? 'Disconnect Wallet' : 'Connect Wallet'}
    </button>
  );
};
