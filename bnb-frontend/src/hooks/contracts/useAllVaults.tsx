import { useEffect } from 'react';

import { VaultContract } from 'constants/contracts';

import { useAccount, useBlockNumber, useReadContract } from 'wagmi';
import { ICover, IVault } from 'types/common';
import { ChainType } from 'lib/wagmi';

export const useAllVaults = () => {
  const { chain } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: vaults, refetch } = useReadContract({
    abi: VaultContract.abi,
    address: VaultContract.addresses[(chain as ChainType)?.chainNickName || 'bscTest'],
    functionName: 'getVaults',
    args: [],
  });

  // useEffect(() => {
  //   refetch();
  // }, [blockNumber]);

  if (!vaults) return [];

  try {
    const result = vaults as IVault[];
    if (!result) return [];

    return result;
  } catch (error) {
    return [];
  }
};
