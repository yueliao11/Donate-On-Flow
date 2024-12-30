import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
  const { user, logIn, logOut } = useAuth();

  return (
    <header className="bg-white shadow">
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
                to="/create"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Create Project
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {!user?.loggedIn ? (
              <button
                onClick={logIn}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {user.addr?.slice(0, 6)}...{user.addr?.slice(-4)}
                </span>
                <button
                  onClick={logOut}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};