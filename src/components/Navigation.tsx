import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ethers } from 'ethers';
import { Menu } from '@headlessui/react';
import { WalletIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { TelegramUser } from './TelegramUser';

export const Navigation: React.FC = () => {
  const { connected, walletAddress, logIn, logOut, signer } = useAuth();
  const [balance, setBalance] = useState<string>('0');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTelegram] = useState(() => Boolean(window.Telegram?.WebApp));

  useEffect(() => {
    const fetchBalance = async () => {
      if (signer && walletAddress) {
        try {
          const balance = await signer.getBalance();
          setBalance(ethers.utils.formatEther(balance));
        } catch (error) {
          console.error('Error fetching balance:', error);
          setBalance('0');
        }
      }
    };

    fetchBalance();
  }, [signer, walletAddress]);

  // 格式化钱包地址显示
  const formatAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-emerald-600">
                Donate On Flow
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
              >
                Projects
              </Link>
              <Link
                to="/create-project"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Create Project
              </Link>
              {connected && (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isTelegram ? (
              <TelegramUser />
            ) : (
              <div>Welcome!</div>
            )}
            {connected ? (
              <Menu as="div" className="relative ml-3">
                <Menu.Button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-lg border border-gray-300">
                  <WalletIcon className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    <span className="font-medium">{parseFloat(balance).toFixed(4)} FLOW</span>
                  </span>
                  <span>{formatAddress(walletAddress)}</span>
                  <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                </Menu.Button>

                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none">
                  <div className="px-4 py-3">
                    <p className="text-sm text-gray-900">Connected Wallet</p>
                    <p className="text-sm font-medium text-gray-500 truncate">
                      {walletAddress}
                    </p>
                  </div>
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/dashboard"
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } block px-4 py-2 text-sm text-gray-700`}
                        >
                          Dashboard
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/create-project"
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } block px-4 py-2 text-sm text-gray-700`}
                        >
                          Create Project
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={logOut}
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } block w-full text-left px-4 py-2 text-sm text-red-600`}
                        >
                          Disconnect
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Menu>
            ) : (
              <button
                onClick={logIn}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
