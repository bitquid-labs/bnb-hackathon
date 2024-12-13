import { defineChain } from 'viem';

import { ChainType } from 'lib/wagmi';

export const pwrlabs: ChainType = defineChain({
  id: 21000001,
  chainNickName: 'pwr',
  faucet: 'https://faucet.pwrlabs.io/',
  name: 'BTC+ Network',
  logo: '/images/pwr.png',
  nativeCurrency: { name: 'BTCP', symbol: 'BTCP', decimals: 8 },
  rpcUrls: {
    default: { http: ['https://bitcoinplus.pwrlabs.io/'] },
  },
  blockExplorers: {
    default: { name: 'Etherscan', url: 'https://btcplusexplorer.pwrlabs.io/' },
  },
  contracts: {},
});
