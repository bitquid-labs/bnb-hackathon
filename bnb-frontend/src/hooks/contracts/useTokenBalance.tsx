import { useEffect } from 'react';
import { useAccount, useBlockNumber, useReadContract } from 'wagmi';
import { erc20Abi } from "viem";

export const useTokenBalance = (indexToken: string | undefined) => {
  const { chain, address } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: balance, refetch } = useReadContract({
    abi: erc20Abi,
    address: indexToken as `0x${string}`,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
  });

  useEffect(() => {
    refetch();
  }, [blockNumber]);

  if (!balance) return 0;
//   console.log('BQBTC Balance: ', balance);

  try {
    const result = balance;
    if (!result) return 0;

    return result;
  } catch (error) {
    return 0;
  }
};
