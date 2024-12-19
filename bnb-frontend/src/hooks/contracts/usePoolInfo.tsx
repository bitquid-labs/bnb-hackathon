import { useEffect } from 'react';

import { ICoverContract, InsurancePoolContract } from 'constants/contracts';

import { useAccount, useBlockNumber, useReadContract } from 'wagmi';
import { ICover, RiskType } from 'types/common';
import { bnToNumber } from 'lib/number';
import { ChainType } from 'lib/wagmi';

import { IPool } from 'types/common';

export const usePoolInfo = (poolId: number) => {
  const { chain } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: poolInfo, refetch } = useReadContract({
    abi: InsurancePoolContract.abi,
    address: InsurancePoolContract.addresses[(chain as ChainType)?.chainNickName],
    functionName: 'getPool',
    args: [poolId],
  });

  useEffect(() => {
    refetch();
  }, [blockNumber]);

  if (!poolInfo) return undefined;

  try {
    const result = poolInfo as IPool;
    if (!result) return undefined;
    
    return result;
  } catch (error) {
    return undefined;
  }
};
