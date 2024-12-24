import {useAccount} from 'wagmi';
import { MainChain } from 'lib/config';

export default function useWallet() {
  const {address, isConnected, connector, chain} = useAccount();

  return {
    address: address,
    active: isConnected,
    connector,
    chainId: chain?.id || MainChain.id
  };
}
