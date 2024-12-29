import { useEffect } from 'react';

import { ICoverContract } from 'constants/contracts';

import { useAccount, useBlockNumber, useReadContract } from 'wagmi';
import { IUserCover } from 'types/common';
import { ChainType } from 'lib/wagmi';

export const useAllUserCovers = (address: string) => {
  const { chain } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: userCovers, refetch } = useReadContract({
    abi: ICoverContract.abi,
    address: ICoverContract.addresses[(chain as ChainType)?.chainNickName],
    functionName: 'getAllUserCovers',
    args: [address],
  });

  useEffect(() => {
    refetch();
  }, [blockNumber]);

  console.log('raw user covers:', userCovers)

  if (!userCovers) return [];

  try {
    const result = userCovers as IUserCover[];
    if (!result) return [];

    return result;
  } catch (error) {
    return [];
  }
};
