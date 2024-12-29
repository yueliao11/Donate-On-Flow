import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { Wallet } from 'lucide-react';

export const Header: React.FC = () => {
  const { isConnected, connect, disconnect } = useAuthContext();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          CharityFlow
        </Link>
        
        <div className="flex items-center gap-4">
          <Link 
            to="/create" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Start a Project
          </Link>
          
          <button
            onClick={isConnected ? disconnect : connect}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Wallet size={20} />
            {isConnected ? 'Disconnect' : 'Connect Wallet'}
          </button>
        </div>
      </div>
    </header>
  );
}