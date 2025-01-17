import { createConfig } from 'wagmi'
import { http } from 'viem'
import { mainnet } from 'wagmi/chains'
import { connectorsForWallets } from '@rainbow-me/rainbowkit'
//import { okxWallet } from '@rainbow-me/rainbowkit/wallets'
import {
    injectedWallet,
    rainbowWallet,
    walletConnectWallet,
    trustWallet,
    metaMaskWallet,
  } from '@rainbow-me/rainbowkit/wallets'
  

//const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '9039b7013e5153893891dd9c89b8beb3'

// Flow Testnet 配置
export const FLOW_TESTNET = {
  id: 747,
  name: 'Flow Testnet',
  network: 'flow-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Flow',
    symbol: 'FLOW',
  },
  rpcUrls: {
    default: {
      http: [import.meta.env.VITE_FLOW_ACCESS_NODE || 'https://rest-testnet.onflow.org']
    },
  },
  blockExplorers: {
    default: {
      name: 'Flowscan',
      url: 'https://testnet.flowscan.org'
    },
  }
}

const connectors = connectorsForWallets(
    [
      {
        groupName: 'Recommended',
        wallets: [
          injectedWallet,
          metaMaskWallet,
          rainbowWallet,
          walletConnectWallet,
          trustWallet,
        ],
      },
    ],
    {
      appName: 'Donation On Flow',
      projectId: process.env.VITE_WALLETCONNECT_PROJECT_ID || '9039b7013e5153893891dd9c89b8beb3',
    }
  )



export const config = createConfig({
  connectors,
  chains: [FLOW_TESTNET],
  transports: {
    [FLOW_TESTNET.id]: http()
  }
})

export const { chains } = config 