import { useEffect } from 'react';

import { VaultContract } from 'constants/contracts';

import { useAccount, useBlockNumber, useReadContract } from 'wagmi';
import { ICover, IVault } from 'types/common';
import { ChainType } from 'lib/wagmi';

export const useVault = (vaultId: number) => {
  const { chain } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: vaultData, refetch } = useReadContract({
    abi: VaultContract.abi,
    address: VaultContract.addresses[(chain as ChainType)?.chainNickName || 'bscTest'],
    functionName: 'getVault',
    args: [vaultId],
  });

  // useEffect(() => {
  //   refetch();
  // }, [blockNumber]);

  if (!vaultData) return undefined;

  try {
    const result = vaultData as IVault;
    if (!result) return undefined;

    return result;
  } catch (error) {
    return undefined;
  }
};
