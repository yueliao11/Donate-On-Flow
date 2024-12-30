import * as fcl from '@onflow/fcl';
import { getScriptFromFile } from './utils';

export const getWalletBalance = async (address: string) => {
  try {
    const script = await getScriptFromFile('get-fusd-balance.cdc');
    const balance = await fcl.query({
      cadence: script,
      args: (arg: any, t: any) => [arg(address, t.Address)],
    });
    return parseFloat(balance);
  } catch (error) {
    console.error('Error getting FUSD balance:', error);
    return 0;
  }
};
