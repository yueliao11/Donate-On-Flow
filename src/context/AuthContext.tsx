'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { OKXUniversalConnectUI, THEME } from '@okxconnect/ui';
import { ethers } from 'ethers';
import { CharityProject__factory } from '../types/factories/CharityProject__factory';

// Flow EVM Testnet 配置
const FLOW_TESTNET = {
  id: 545,
  name: 'Flow EVM Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Flow',
    symbol: 'FLOW',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.evm.nodes.onflow.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Flow Diver',
      url: 'https://testnet.flowdiver.io',
    },
  },
};

interface AuthContextType {
  connected: boolean;
  walletAddress: string | null;
  chainId: string | null;
  signer: ethers.Signer | null;
  charityContract: ethers.Contract | null;
  telegramUser: any | null;
  user: {
    addr: string | null;
    loggedIn: boolean;
  };
  logIn: () => Promise<void>;
  logOut: () => Promise<void>;
  telegramLogIn: () => Promise<void>;
  telegramLogOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [client, setClient] = useState<OKXUniversalConnectUI | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [charityContract, setCharityContract] = useState<ethers.Contract | null>(null);
  const [telegramUser, setTelegramUser] = useState<any | null>(null);
  const [user, setUser] = useState({
    addr: null,
    loggedIn: false
  });

  useEffect(() => {
    const initClient = async () => {
      try {
        const uiClient = await OKXUniversalConnectUI.init({
          dappMetaData: {
            name: 'Donate On Flow',
            icon: 'https://cryptologos.cc/logos/flow-flow-logo.png',
          },
          actionsConfiguration: {
            returnStrategy: 'none',
            modals: 'all',
          },
          uiPreferences: {
            theme: THEME.LIGHT,
          },
        });
        setClient(uiClient);
      } catch (error) {
        console.error('Failed to initialize OKX UI:', error);
      }
    };
    initClient();
  }, []);

  useEffect(() => {
    if (connected && walletAddress) {
      setUser({
        addr: walletAddress,
        loggedIn: true
      });
    } else {
      setUser({
        addr: null,
        loggedIn: false
      });
    }
  }, [connected, walletAddress]);

  const logIn = async () => {
    if (!client) return;
    try {
      // 检查是否在 Telegram 环境中
      const isTelegram = window.Telegram?.WebApp;

      const session = await client.openModal({
        namespaces: {
          eip155: {
            chains: ['eip155:747'],
            defaultChain: '747',
          },
        },
      });

      if (!session || !session.namespaces.eip155) {
        console.error('Session is undefined or invalid');
        return;
      }

      const address = session.namespaces.eip155.accounts[0]?.split(':')[2];
      const chain = session.namespaces.eip155.chains[0]?.split(':')[1] || null;

      if (isTelegram) {
        // 使用 Telegram WebApp API
        const provider = new ethers.providers.Web3Provider(window.okxwallet);
        const newSigner = provider.getSigner();
        const signerAddress = await newSigner.getAddress();

        if (!signerAddress) {
          throw new Error('Failed to get signer address');
        }

        setWalletAddress(signerAddress);
        setChainId(chain);
        setConnected(true);
        setSigner(newSigner);

        // 初始化合约
        const contractAddress = import.meta.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
        if (contractAddress) {
          const contract = CharityProject__factory.connect(contractAddress, newSigner);
          setCharityContract(contract);
        }
      } else {
        // Web 环境的处理逻辑
        if (!window.ethereum) {
          throw new Error('No ethereum provider found');
        }

        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${FLOW_TESTNET.id.toString(16)}` }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: `0x${FLOW_TESTNET.id.toString(16)}`,
                  chainName: FLOW_TESTNET.name,
                  nativeCurrency: FLOW_TESTNET.nativeCurrency,
                  rpcUrls: FLOW_TESTNET.rpcUrls.default.http,
                  blockExplorerUrls: [FLOW_TESTNET.blockExplorers.default.url],
                },
              ],
            });
          } else {
            throw switchError;
          }
        }

        await window.ethereum.request({
          method: 'eth_requestAccounts'
        });

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.ready;

        const newSigner = provider.getSigner();
        const signerAddress = await newSigner.getAddress();

        if (!signerAddress) {
          throw new Error('Failed to get signer address');
        }

        setWalletAddress(signerAddress);
        setChainId(chain);
        setConnected(true);
        setSigner(newSigner);

        const contractAddress = import.meta.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
        if (contractAddress) {
          const contract = CharityProject__factory.connect(contractAddress, newSigner);
          setCharityContract(contract);
        }
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  };

  const logOut = async () => {
    if (!client) return;
    try {
      await client.disconnect();

      // 移除事件监听器
      if (window.ethereum) {
        window.ethereum.removeAllListeners('chainChanged');
        window.ethereum.removeAllListeners('accountsChanged');
      }

      setWalletAddress(null);
      setChainId(null);
      setConnected(false);
      setSigner(null);
      setCharityContract(null);
      setUser({
        addr: null,
        loggedIn: false
      });
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const telegramLogIn = async () => {
    if (typeof window !== 'undefined' && WebApp) {
      try {
        const botId = import.meta.env.VITE_TELEGRAM_BOT_ID;
        const initData = WebApp.initData;
        const isValid = validate3rd(initData, Number(botId));

        if (isValid) {
          const user = WebApp.initDataUnsafe.user;
          if (user) {
            setTelegramUser({
              id: user.id,
              first_name: user.first_name,
              username: user.username
            });
          }
        }
      } catch (error) {
        console.error('Error validating Telegram user:', error);
      }
    }
  };

  const telegramLogOut = () => {
    setTelegramUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        connected,
        walletAddress,
        chainId,
        signer,
        charityContract,
        telegramUser,
        user,
        logIn,
        logOut,
        telegramLogIn,
        telegramLogOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};