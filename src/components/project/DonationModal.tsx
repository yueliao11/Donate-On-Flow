import React, { useState } from 'react';
import { useWallet } from '../../contexts/WalletContext';
import { ConnectWalletPrompt } from '../ConnectWalletPrompt';

interface DonationModalProps {
  projectId: number;
  isOpen: boolean;
  onClose: () => void;
  onDonationComplete: () => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({
  projectId,
  isOpen,
  onClose,
  onDonationComplete,
}) => {
  const { loggedIn, walletAddress } = useWallet();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  if (!loggedIn || !walletAddress) {
    return (
      <ConnectWalletPrompt 
        message="请先连接钱包进行捐赠"
        size="md"
      />
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loggedIn || !walletAddress) {
      alert('请先连接钱包');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert('请输入有效金额');
      return;
    }

    setLoading(true);
    try {
      // TODO: 实现 Privy 的交易逻辑
      const tx = await user.wallet.sendTransaction({
        to: projectId.toString(),
        value: ethers.utils.parseEther(amount)
      });
      
      await tx.wait();
      onDonationComplete();
      onClose();
      setAmount('');
    } catch (error: any) {
      console.error('捐赠错误:', error);
      alert(error.message || '捐赠失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (!loggedIn) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <p className="text-center text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          捐赠
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              金额 (FLOW)
            </label>
            <div className="mt-1">
              <input
                type="number"
                step="0.01"
                min="0"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
              {loading ? '处理中...' : '捐赠'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};