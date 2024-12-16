import { useEffect } from 'react';

import { ICoverContract, InsurancePoolContract } from 'constants/contracts';

import { useAccount, useBlockNumber, useReadContract } from 'wagmi';
import { ICover, RiskType } from 'types/common';
import { bnToNumber } from 'lib/number';
import { ChainType } from 'lib/wagmi';

type CoverType = [
  bigint,
  string,
  RiskType,
  string,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  string
];

export const usePoolInfo = (poolId: number) => {
  const { chain } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: poolInfo, refetch } = useReadContract({
    abi: InsurancePoolContract.abi,
    address: InsurancePoolContract.addresses[(chain as ChainType)?.chainNickName],
    functionName: 'pools',
    args: [poolId],
  });

  useEffect(() => {
    refetch();
  }, [blockNumber]);

  console.log('pool info:', poolInfo)

  if (!poolInfo) return undefined;

  try {
    const result = poolInfo as CoverType;
    if (!result) return undefined;

    return {
      id: Number(result[0]),
      coverName: result[1],
      riskType: result[2],
      chains: result[3],
      capacity: Number(result[4]),
      cost: Number(result[5]),
      capacityAmount: bnToNumber(result[6]),
      coverValues: bnToNumber(result[7]),
      maxAmount: bnToNumber(result[8]),
      poolId: Number(result[9]),
      CID: result[10],
    };
  } catch (error) {
    return undefined;
  }
};
