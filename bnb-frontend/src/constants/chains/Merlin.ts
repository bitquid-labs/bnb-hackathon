import { defineChain } from 'viem';

import { ChainType } from 'lib/wagmi';

export const merlin: ChainType = defineChain({
  id: 686868,
  chainNickName: 'merlin',
  faucet: 'https://discord.gg/merlinchain',
  name: 'Merlin Testnet',
  logo: '/svg/merlin.svg',
  nativeCurrency: { name: 'BTC', symbol: 'BTC', decimals: 8 },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.merlinchain.io'] },
  },
  blockExplorers: {
    default: {
      name: 'Test Merlin Explorer',
      url: 'https://testnet-scan.merlinchain.io',
    },
  },
  contracts: {},
});
