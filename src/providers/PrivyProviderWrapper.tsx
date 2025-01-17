import { PrivyProvider } from '@privy-io/react-auth';
import React from 'react';

export const PrivyProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'cm60s4pon02i9mw0czhv372cu';
  
  if (!appId) {
    throw new Error('NEXT_PUBLIC_PRIVY_APP_ID is not set');
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          logo: 'https://cryptologos.cc/logos/flow-flow-logo.png',
        },
        embeddedWallets: {
          createOnLogin: 'all-users',
        },
        defaultChain: {
          id: 545,
          name: 'Flow Testnet',
          network: 'flow-testnet',
          nativeCurrency: {
            name: 'Flow',
            symbol: 'FLOW',
            decimals: 18,
          },
          rpcUrls: {
            default: {
              http: ['https://testnet.evm.nodes.onflow.org'],
            },
          },
          blockExplorers: {
            default: {
              name: 'Flowscan Testnet',
              url: 'https://testnet.flowscan.org',
            },
          },
        },
        supportedChains: [
          {
            id: 545,
            name: 'Flow Testnet',
            network: 'flow-testnet',
            nativeCurrency: {
              name: 'Flow',
              symbol: 'FLOW',
              decimals: 18,
            },
            rpcUrls: {
              default: {
                http: ['https://testnet.evm.nodes.onflow.org'],
              },
            },
            blockExplorers: {
              default: {
                name: 'Flowscan Testnet',
                url: 'https://testnet.flowscan.org',
              },
            },
          },
        ],
      }}
    >
      {children}
    </PrivyProvider>
  );
}; 