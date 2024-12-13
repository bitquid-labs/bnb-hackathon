import { mainnet } from 'wagmi/chains';
import { Chain } from 'viem';

export const chains = [mainnet] as const;

export type ChainType = Chain & {
  logo: string;
  chainNickName: string;
  faucet: string;
};