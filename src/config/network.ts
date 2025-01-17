export const FLOW_TESTNET = {
  id: 'flow-testnet',
  chainId: 'flow-testnet',
  rpcUrl: 'https://rest-testnet.onflow.org',
  name: 'Flow Testnet',
  nativeCurrency: {
    decimals: 8,
    name: 'Flow',
    symbol: 'FLOW',
  },
  blockExplorers: {
    default: {
      name: 'Flow View Source', 
      url: 'https://testnet.flowscan.org',
    },
  },
}; 