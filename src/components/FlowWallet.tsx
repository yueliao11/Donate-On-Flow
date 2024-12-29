import React from 'react';
import { useAuthContext } from '../context/AuthContext';

export const FlowWallet: React.FC = () => {
  const { flowUser, flowLoggedIn, flowLogIn, flowLogOut } = useAuthContext();

  return (
    <div className="flex flex-col items-center justify-center p-4 text-center space-y-4">
      <h2 className="text-xl font-bold">Flow Wallet</h2>
      {flowLoggedIn ? (
        <div className="space-y-4">
          <p className="text-sm">
            Connected as:{' '}
            <span className="font-mono">{flowUser?.addr}</span>
          </p>
          <button
            onClick={flowLogOut}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Disconnect Flow Wallet
          </button>
        </div>
      ) : (
        <button
          onClick={flowLogIn}
          className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors"
        >
          Connect Flow Wallet
        </button>
      )}
    </div>
  );
};
