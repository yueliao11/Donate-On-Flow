import * as fcl from '@onflow/fcl';

// Flow blockchain configuration
export const initializeFlow = () => {
  fcl.config()
    .put("accessNode.api", "https://rest-testnet.onflow.org")
    .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")
    .put("app.detail.title", "CharityFlow")
    .put("app.detail.icon", "https://placekitten.com/g/200/200");
};