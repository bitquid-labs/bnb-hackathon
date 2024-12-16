import { useEffect } from 'react';

import { ICoverContract } from 'constants/contracts';

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

export const useCoverInfo = (coverId: number) => {
  const { chain } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: userCover, refetch } = useReadContract({
    abi: ICoverContract.abi,
    address: ICoverContract.addresses[(chain as ChainType)?.chainNickName],
    functionName: 'covers',
    args: [coverId],
  });

  useEffect(() => {
    refetch();
  }, [blockNumber]);

  if (!userCover) return undefined;

  try {
    const result = userCover as CoverType;
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
