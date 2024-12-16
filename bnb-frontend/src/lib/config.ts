import { http, createConfig } from 'wagmi';
import { pwrlabs } from 'constants/chains/pwrLabs';
import { bob } from 'constants/chains/BOB';
import { merlin } from 'constants/chains/Merlin';
import { bevm } from 'constants/chains/BEVM';
import { rsk } from 'constants/chains/RSK';
import { core } from 'constants/chains/Core';
import { bitlayer } from 'constants/chains/Bitlayer';
import { bscTest } from 'constants/chains/bscTest';

import '@rainbow-me/rainbowkit/styles.css';

import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  rainbowWallet,
  walletConnectWallet,
  coinbaseWallet,
  gateWallet,
  metaMaskWallet,
  okxWallet,
  bitgetWallet,
  binanceWallet 
} from '@rainbow-me/rainbowkit/wallets';

export const MainChain = bscTest;

export const projectId = process.env.REACT_APP_PROJECT_ID;

if (!projectId) throw new Error('Project ID is not defined');

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        metaMaskWallet,
        gateWallet,
        okxWallet,
        binanceWallet,
        bitgetWallet,
        rainbowWallet,
        walletConnectWallet,
        coinbaseWallet,
      ],
    },
  ],
  {
    appName: 'My RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
  }
);

const config = createConfig({
  connectors,
  chains: [merlin, core, bitlayer, bscTest],
  transports: {
    [merlin.id]: http(),
    [core.id]: http(),
    [bitlayer.id]: http(),
    [bscTest.id]: http(),
  },
  ssr: true,
});

export const metadata = {
  name: 'BQ Labs',
  description: 'AppKit Example',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

export default config;