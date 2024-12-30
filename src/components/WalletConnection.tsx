'use client';

import { useAuth } from '@/context/AuthContext';

export default function WalletConnection() {
  const { connected, walletAddress, chainId, logIn, logOut } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-sm w-full">
        <h1 className="text-2xl font-bold text-center mb-2">OKX Wallet Connect</h1>

        {connected ? (
          <div>
            <p className="text-gray-600 text-center mb-6">
              Thanks for connecting your wallet!
            </p>
            <div className="space-y-4">
              <p className="text-sm">
                Wallet Address:{' '}
                <span className="font-mono break-all">
                  {walletAddress}
                </span>
              </p>
              {chainId && (
                <p className="text-sm">
                  Chain ID: <span className="font-mono">{chainId}</span>
                </p>
              )}
              <button
                onClick={logOut}
                className="w-full py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
              >
                Disconnect Wallet
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 text-center mb-6">
              Connect your wallet with OKX
            </p>
            <button
              onClick={logIn}
              className="w-full py-2 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors"
            >
              Connect OKX Wallet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
