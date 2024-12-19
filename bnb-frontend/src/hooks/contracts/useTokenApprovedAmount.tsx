import { InsurancePoolContract } from "constants/contracts";
import { bnToNumber } from "lib/number";
import { ChainType } from "lib/wagmi";
import { useEffect } from "react";
import { erc20Abi } from "viem";
import { useAccount, useBlockNumber, useReadContract } from "wagmi";

export const useERC20TokenApprovedTokenAmount = (indexToken: string | undefined, target: string | undefined, decimals: number, fastFetch: boolean = false) => {
  const {address, chain} = useAccount();
  const {data: blockNumber} = useBlockNumber({watch: true});
  const {data: allowance, refetch} = useReadContract({
    abi: erc20Abi,
    address: indexToken as `0x${string}`,
    functionName: 'allowance',
    args: [address as `0x${string}`, target as `0x${string}`],
    query: {
      refetchInterval: fastFetch ? 200 : 5000
    }
  });

  useEffect(() => {
    refetch();
  }, [blockNumber]);

  return bnToNumber(allowance as bigint, decimals);
};