import { ChainType } from 'lib/wagmi';
import { defineChain } from 'viem';

export const bscTest: ChainType = defineChain({
  id: 97,
  chainNickName: 'bscTest',
  faucet: 'https://faucet.quicknode.com/binance-smart-chain/bnb-testnet',
  name: 'BOB Sepolia',
  logo: '/svg/bob.svg',
  nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 8 },
  rpcUrls: {
    default: { http: ['https://bsc-testnet-dataseed.bnbchain.org'] },
  },
  blockExplorers: {
    default: {
      name: 'BSCscan',
      url: 'https://bsctrace.com/',
    },
  },
  contracts: {},
});
