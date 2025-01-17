import { usePrivy } from '@privy-io/react-auth';
import { useWallet } from '../contexts/WalletContext';
import { ConnectWalletPrompt } from './ConnectWalletPrompt';
import { useEffect, useState } from 'react';

export function DonateButton({ projectId }: { projectId: string }) {
  const { loggedIn, walletAddress, connectWallet } = useWallet();
  const { login, authenticated, user } = usePrivy();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
  
  useEffect(() => {
    // 当Privy认证完成后自动连接钱包并准备捐赠
    if (authenticated && user?.wallet?.address && !walletAddress) {
      connectWallet('privy').then(() => {
        if(showDonateModal) {
          handleDonation();
        }
      });
    }
  }, [authenticated, user, walletAddress]);

  const handleDonateClick = async () => {
    if (!loggedIn || !walletAddress) {
      setIsProcessing(true);
      setShowDonateModal(true);
      try {
        await login();
      } catch (error) {
        console.error('Login error:', error);
        alert('Failed to connect wallet');
        setShowDonateModal(false);
      } finally {
        setIsProcessing(false);
      }
      return;
    }
    
    handleDonation();
  };

  const handleDonation = async () => {
    try {
      setIsProcessing(true);
      // 原有捐赠逻辑保持不变
      // ... 处理捐赠逻辑
      setShowDonateModal(false);
    } catch (error) {
      console.error('Donation error:', error);
      alert('Failed to process donation');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!loggedIn || !walletAddress) {
    return (
      <ConnectWalletPrompt 
        message="Connect wallet to donate"
        size="md"
        onClick={login}
        disabled={isProcessing}
      />
    );
  }

  return (
    <button 
      onClick={handleDonateClick}
      disabled={isProcessing}
      className="px-6 py-3 text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 
                transition-colors duration-200 focus:outline-none focus:ring-2 
                focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 
                disabled:cursor-not-allowed"
    >
      {isProcessing ? 'Processing...' : 'Donate'}
    </button>
  );
} 