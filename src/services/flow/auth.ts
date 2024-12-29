import * as fcl from '@onflow/fcl';

export const connectWallet = () => fcl.authenticate();
export const disconnectWallet = () => fcl.unauthenticate();
export const getCurrentUser = () => fcl.currentUser().snapshot();

export const subscribeToAuthChanges = (callback: (user: any) => void) => {
  return fcl.currentUser().subscribe(callback);
};