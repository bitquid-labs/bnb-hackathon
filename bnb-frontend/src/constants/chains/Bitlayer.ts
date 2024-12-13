import { defineChain } from 'viem';

import { ChainType } from 'lib/wagmi';

export const bitlayer: ChainType = defineChain({
  id: 200810,
  chainNickName: 'bitlayer',
  faucet: 'https://www.bitlayer.org/faucet',
  name: 'Bitlayer Testnet',
  logo: '/svg/bitlayer.svg',
  nativeCurrency: { name: 'BTC', symbol: 'BTC', decimals: 18 },
  rpcUrls: {
    default: { http: ['	https://testnet-rpc.bitlayer.org'] },
  },
  blockExplorers: {
    default: {
      name: 'Bitlayer Testnet',
      url: 'https://testnet-scan.bitlayer.org',
    },
  },
  contracts: {},
});
