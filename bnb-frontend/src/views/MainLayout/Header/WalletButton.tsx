import React from 'react';
import { useAccount, useDisconnect, useSwitchChain } from 'wagmi';
import { chains } from 'lib/wagmi';

import PlusIcon from '~/svg/plus.svg';

import {
  ConnectButton,
  useAccountModal,
  useChainModal,
  useConnectModal,
} from '@rainbow-me/rainbowkit';
import IconWalletHeader from 'assets/icons/IconWalletHeader';

const ConnectWalletButton: React.FC = () => {
  const { openChainModal } = useChainModal();
  const { openAccountModal } = useAccountModal();
  const { openConnectModal } = useConnectModal();

  const { chain, address, isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();

  const handleDisconnect = async () => {
    try {
      await disconnectAsync();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error disconnecting:', error);
    }
  };

  // Function to truncate Ethereum address
  const truncateAddress = (address: string) => {
    return address.slice(0, 6) + '...' + address.slice(-4);
  };

  return (
    <div>
      {isConnected && address ? (
        <div className='flex items-center gap-2'>
          {/* <button
            className='bg-primary-200 flex h-[46px] w-[46px] items-center justify-center rounded-md p-1'
            onClick={openChainModal}
          >
            <Image
              src={chains.find((c) => c.id === chain?.id)?.logo ?? ''}
              alt='chain'
              width={24}
              height={24}
            />
          </button> */}
          {/* <Button variant='gradient' size='lg' onClick={openAccountModal}>
            {truncateAddress(address)}
          </Button> */}
          <button
            className='bg-[#F6F6F6] rounded-12 flex items-center gap-4 py-12 px-20'
            onClick={openAccountModal}
          >
            <span className='text-[#0A0A0A]'>
              {truncateAddress(address)}
            </span>
          </button>
          {/* <ConnectButton /> */}
        </div>
      ) : (
        <button
          onClick={openConnectModal}
          className='bg-[#F6F6F6] rounded-12 flex items-center gap-4 py-12 px-20'
        >
          <span className='text-[#0A0A0A]'>Connect Wallet</span>
          <IconWalletHeader />
        </button>
        // <Button
        //   variant='gradient'
        //   leftIcon={<PlusIcon />}
        //   classNames={{
        //     leftIcon:
        //       'w-[18px] h-[18px] bg-white rounded-full flex items-center justify-center',
        //   }}
        //   size='lg'
        //   onClick={openConnectModal}
        // >
        //   Connect Wallet
        // </Button>
      )}
    </div>
  );
};

export default ConnectWalletButton;





// import React from "react";

// const WalletButton: React.FC = () => {
//   return (
//     <div className="px-20 py-14 rounded-12 bg-[#F6F6F6] text-[#000]">
//       0ex030........023
//     </div>
//   )
// }

// export default WalletButton;