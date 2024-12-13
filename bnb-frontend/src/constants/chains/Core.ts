import { defineChain } from 'viem';

import { ChainType } from 'lib/wagmi';

export const core: ChainType = defineChain({
  id: 1115,
  chainNickName: 'core',
  faucet: 'https://scan.test.btcs.network/faucet',
  name: 'Core Blockchain Testnet',
  logo: '/svg/core.svg',
  nativeCurrency: { name: 'tCORE', symbol: 'tCORE', decimals: 8 },
  rpcUrls: {
    default: { http: ['https://rpc.test.btcs.network'] },
  },
  blockExplorers: {
    default: {
      name: 'Core',
      url: 'https://scan.test.btcs.network/',
    },
  },
  contracts: {},
});
