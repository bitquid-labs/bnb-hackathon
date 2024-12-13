import { defineChain } from 'viem';

import { ChainType } from 'lib/wagmi';

export const bevm: ChainType = defineChain({
  id: 11503,
  chainNickName: 'bevm',
  faucet: 'https://bevm-testnet-faucet-alpha.vercel.app/',
  name: 'BEVM Testnet',
  logo: '/svg/bevm.svg',
  nativeCurrency: { name: 'BTC', symbol: 'BTC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet.bevm.io'] },
  },
  blockExplorers: {
    default: {
      name: 'BEVM Testnet',
      url: 'https://scan-testnet.bevm.io',
    },
  },
  contracts: {},
});
