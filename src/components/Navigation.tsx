import React from 'react';
import { Link } from 'react-router-dom';
import { FlowWallet } from './FlowWallet';
import { TelegramUser } from './TelegramUser';

export const Navigation: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">
                Donate on Flow
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
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <TelegramUser />
            <FlowWallet />
          </div>
        </div>
      </div>
    </nav>
  );
};
