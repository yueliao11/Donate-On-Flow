import { useState, useEffect } from 'react';
import * as authService from '../services/flow/auth';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscription = authService.subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      subscription();
    };
  }, []);

  const connect = async () => {
    try {
      await authService.connectWallet();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  };

  const disconnect = () => {
    authService.disconnectWallet();
  };

  return {
    user,
    loading,
    connect,
    disconnect,
    isConnected: user?.loggedIn || false
  };
};