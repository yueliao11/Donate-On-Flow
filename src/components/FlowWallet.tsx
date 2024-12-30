import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserMenu } from './user/UserMenu';

export const FlowWallet: React.FC = () => {
  const { user, logIn } = useAuth();

  return (
    <div>
      {!user?.loggedIn ? (
        <button
          onClick={logIn}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Connect Wallet
        </button>
      ) : (
        <UserMenu />
      )}
    </div>
  );
};
