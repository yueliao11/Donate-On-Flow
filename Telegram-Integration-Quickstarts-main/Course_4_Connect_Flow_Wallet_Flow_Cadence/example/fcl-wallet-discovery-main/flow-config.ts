import { config } from '@onflow/fcl';

config({
  'accessNode.api': 'https://rest-testnet.onflow.org', // 从 mainnet 改为 testnet
  'flow.network': 'testnet', // 从 mainnet 改为 testnet
  'discovery.wallet': 'https://fcl-discovery.onflow.org/authn',
});