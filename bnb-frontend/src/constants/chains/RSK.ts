import { defineChain } from 'viem';

import { ChainType } from 'lib/wagmi';

export const rsk: ChainType = defineChain({
  id: 31,
  chainNickName: 'rsk',
  faucet: 'https://faucet.rootstock.io/',
  name: 'Rootstock Testnet',
  logo: '/svg/rsk.svg',
  nativeCurrency: { name: 'TRBTC', symbol: 'TRBTC', decimals: 8 },
  rpcUrls: {
    default: { http: ['https://public-node.testnet.rsk.co'] },
  },
  blockExplorers: {
    default: {
      name: 'Rootstock Testnet Explorer',
      url: 'https://explorer.testnet.rsk.co',
    },
  },
  contracts: {},
});
