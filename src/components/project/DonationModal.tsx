import React, { useState } from 'react';
import { ProjectTokenInfo } from './ProjectTokenInfo';
import { X } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';

interface DonationModalProps {
  projectId: string;
  projectTitle: string;
  targetAmount: number;
  tokenSymbol: string;
  tokenSupply: number;
  onDonate: (amount: number) => Promise<void>;
  onClose: () => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({
  projectId,
  projectTitle,
  targetAmount,
  tokenSymbol,
  tokenSupply,
  onDonate,
  onClose,
}) => {
  const [amount, setAmount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const { isConnected, connect } = useAuthContext();

  const handleDonate = async () => {
    if (!isConnected) {
      await connect();
      return;
    }

    try {
      setIsProcessing(true);
      await onDonate(amount);
      onClose();
    } catch (error) {
      console.error('Donation failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const presetAmounts = [10, 50, 100, 500];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Donate to {projectTitle}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Amount (FUSD)
            </label>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmount(preset)}
                  className={`py-2 px-4 rounded-md ${
                    amount === preset
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {preset} FUSD
                </button>
              ))}
            </div>
            <input
              type="number"
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter custom amount"
              min="0"
              step="0.1"
            />
          </div>

          {amount > 0 && (
            <ProjectTokenInfo
              tokenSymbol={tokenSymbol}
              tokenSupply={tokenSupply}
              donationAmount={amount}
              targetAmount={targetAmount}
            />
          )}

          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDonate}
              disabled={amount <= 0 || isProcessing}
              className={`px-4 py-2 rounded-md ${
                amount <= 0 || isProcessing
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isProcessing ? 'Processing...' : isConnected ? 'Donate Now' : 'Connect Wallet to Donate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};