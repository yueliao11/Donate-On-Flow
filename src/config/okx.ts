import { THEME } from '@okxconnect/ui';

export const OKX_CONFIG = {
  dappMetaData: {
    name: 'Donate On Flow',
    icon: '/logo.png',
  },
  actionsConfiguration: {
    returnStrategy: 'tg://resolve',
    modals: 'all',
  },
  uiPreferences: {
    theme: THEME.LIGHT,
  },
  chains: {
    flow: {
      chainId: '747',
      rpcUrl: import.meta.env.VITE_FLOW_ACCESS_NODE || 'https://rest-testnet.onflow.org',
    },
  },
};
