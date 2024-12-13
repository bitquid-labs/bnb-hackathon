import { defineChain } from 'viem';

import { ChainType } from 'lib/wagmi';

export const bob: ChainType = defineChain({
  id: 808813,
  chainNickName: 'bob',
  faucet: 'https://bob-sepolia.gobob.xyz/',
  name: 'BOB Sepolia',
  logo: '/svg/bob.svg',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 8 },
  rpcUrls: {
    default: { http: ['https://bob-sepolia.rpc.gobob.xyz/'] },
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: 'https://bob-sepolia.explorer.gobob.xyz/',
    },
  },
  contracts: {},
});
