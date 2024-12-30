// src/services/ethereum/config.ts
import { ethers } from 'ethers';

export const getProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum);
  }
  return null;
};

export const connectWallet = async () => {
  const provider = getProvider();
  if (!provider) throw new Error("Please install MetaMask");
  await provider.send("eth_requestAccounts", []);
  return provider.getSigner();
};