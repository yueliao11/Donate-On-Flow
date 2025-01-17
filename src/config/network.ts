export const FLOW_TESTNET = {
  id: 545,
  chainId: '545',
  rpcUrl: 'https://testnet.evm.nodes.onflow.org',
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