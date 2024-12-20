import { useEffect } from 'react';

import { InsurancePoolContract } from 'constants/contracts';

import { useAccount, useBlockNumber, useReadContract } from 'wagmi';
import { ICover, IPool, IPoolInfo, IVault } from 'types/common';
import { ChainType } from 'lib/wagmi';

export const usePoolByAddress = (address: string) => {
  const { chain } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: pools, refetch } = useReadContract({
    abi: InsurancePoolContract.abi,
    address: InsurancePoolContract.addresses[(chain as ChainType)?.chainNickName || 'bscTest'],
    functionName: 'getPoolsByAddress',
    args: [address]
  });

  useEffect(() => {
    refetch();
  }, [blockNumber]);

  if (!pools) return [];

  try {
    const result = pools as IPoolInfo[];
    if (!result) return [];

    return result;
  } catch (error) {
    return [];
  }
};
