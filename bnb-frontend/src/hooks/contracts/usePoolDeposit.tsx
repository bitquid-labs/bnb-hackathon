import { useEffect } from 'react';

import { ICoverContract, InsurancePoolContract } from 'constants/contracts';

import { useAccount, useBlockNumber, useReadContract } from 'wagmi';
import { ICover, RiskType } from 'types/common';
import { bnToNumber } from 'lib/number';
import { ChainType } from 'lib/wagmi';

import { IPool } from 'types/common';

export const usePoolDeposit = (poolId: number) => {
  const { chain, address } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: poolDepositData, refetch } = useReadContract({
    abi: InsurancePoolContract.abi,
    address: InsurancePoolContract.addresses[(chain as ChainType)?.chainNickName],
    functionName: 'getUserPoolDeposit',
    args: [poolId, address],
  });

  useEffect(() => {
    refetch();
  }, [blockNumber]);

  console.log('poolDepositData:', poolId, poolDepositData)

  if (!poolDepositData) return undefined;

  try {
    const result = poolDepositData as IPool;
    if (!result) return undefined;
    
    return result;
  } catch (error) {
    return undefined;
  }
};
