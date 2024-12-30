import React from 'react';
import { useAuth } from '../../context/AuthContext';
import * as fcl from '@onflow/fcl';

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
  const { user, logIn } = useAuth();
  const [amount, setAmount] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.addr) {
      alert('Please connect your wallet first');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const transactionId = await fcl.mutate({
        cadence: `
          import CharityProject from 0x945c254064cc292c35FA8516AFD415a73A0b23A0
          import FUSD from 0x9a0766d93b6608b7

          transaction(projectId: UInt64, amount: UFix64) {
            prepare(signer: AuthAccount) {
              let vaultRef = signer.borrow<&FUSD.Vault>(from: /storage/fusdVault)
                ?? panic("Could not borrow reference to the owner's Vault!")

              let donation <- vaultRef.withdraw(amount: amount)
              CharityProject.donate(projectId: projectId, donation: <-donation)
            }
          }
        `,
        args: (arg: any, t: any) => [
          arg(projectId, t.UInt64),
          arg(amount, t.UFix64),
        ],
        payer: fcl.authz,
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 999,
      });

      await fcl.tx(transactionId).onceSealed();
      onDonationComplete();
      onClose();
      setAmount('');
    } catch (error) {
      console.error('Error donating:', error);
      alert('Failed to donate. Please try again.');
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

        {!user?.loggedIn ? (
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Please connect your wallet to make a donation
            </p>
            <button
              onClick={logIn}
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700"
              >
                Amount (FUSD)
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0.1"
                step="0.1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Donating...' : 'Donate'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};