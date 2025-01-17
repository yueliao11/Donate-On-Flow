import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ethers } from 'ethers';

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
  const { connected, walletAddress, charityContract, logIn } = useAuth();
  const [amount, setAmount] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!connected || !walletAddress || !charityContract) {
      alert('Please connect your wallet first');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const tx = await charityContract.donate(projectId, {
        value: ethers.utils.parseEther(amount)
      });
      
      await tx.wait();
      onDonationComplete();
      onClose();
      setAmount('');
    } catch (error: any) {
      console.error('Error donating:', error);
      alert(error.message || 'Failed to donate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Make a Donation
        </h2>

        {!connected ? (
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Please connect your wallet to make a donation
            </p>
            <button
              onClick={logIn}
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Connect Wallet444
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700"
              >
                Amount (FLOW)
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
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
              >
                {loading ? 'Processing...' : 'Donate'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};