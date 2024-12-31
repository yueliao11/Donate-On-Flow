// hardhat.config.cjs
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@typechain/hardhat");
require("dotenv").config({ path: ".env.local" });

const PRIVATE_KEY = process.env.PRIVATE_KEY;

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

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    hardhat: {},
    flowEvm: {
      url: FLOW_TESTNET.rpcUrls.default.http[0],
      chainId: FLOW_TESTNET.id,
      accounts: [PRIVATE_KEY],
      gasPrice: 1000000000
    }
  },
  typechain: {
    outDir: 'src/types',
    target: 'ethers-v5'
  }
};