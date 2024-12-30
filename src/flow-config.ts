import { config } from '@onflow/fcl';

config({
  'app.detail.title': 'Flow Donate',
  'app.detail.icon': 'https://placekitten.com/g/200/200',
  'accessNode.api': 'https://rest-testnet.onflow.org',  // Testnet API
  'flow.network': 'testnet',
  'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn',  // Testnet wallet discovery
  '0xFungibleToken': '0x9a0766d93b6608b7',  // Testnet FungibleToken address
  '0xFUSD': '0xe223d8a629e49c68',  // Testnet FUSD address
  '0xCharityProject': '0x945c254064cc292c35FA8516AFD415a73A0b23A0',  // Your deployed CharityProject address
  '0xCharityProjectV2': '0x945c254064cc292c35FA8516AFD415a73A0b23A0',  // Your deployed CharityProjectV2 address
  'env': 'testnet'
});
