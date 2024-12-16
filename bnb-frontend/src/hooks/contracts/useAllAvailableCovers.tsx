import { useEffect } from 'react';

import { ICoverContract } from 'constants/contracts';
import ICoverAbi from 'constants/abis/InsuranceCover.json';

import { useAccount, useBlockNumber, useReadContract } from 'wagmi';
import { ICover } from 'types/common';
import { ChainType } from 'lib/wagmi';

export const useAllAvailableCovers = () => {
  const { chain } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: availableCovers, refetch } = useReadContract({
    abi: ICoverContract.abi,
    address: ICoverContract.addresses[(chain as ChainType)?.chainNickName || 'bscTest'],
    functionName: 'getAllAvailableCovers',
    args: [],
  });

  // useEffect(() => {
  //   refetch();
  // }, [blockNumber]);

  if (!availableCovers) return [];

  try {
    const result = availableCovers as ICover[];
    if (!result) return [];

    return result;
  } catch (error) {
    return [];
  }
};
