import { InsurancePoolContract } from "constants/contracts";
import { bnToNumber } from "lib/number";
import { ChainType } from "lib/wagmi";
import { useEffect } from "react";
import { erc20Abi } from "viem";
import { useAccount, useBlockNumber, useReadContract } from "wagmi";

export const useTokenName = (indexToken: string | undefined) => {
  const {address, chain} = useAccount();
  const {data: blockNumber} = useBlockNumber({watch: true});
  const {data: tokenName, refetch} = useReadContract({
    abi: erc20Abi,
    address: indexToken as `0x${string}`,
    functionName: 'name',
    args: [],
  });

  useEffect(() => {
    refetch();
  }, [blockNumber]);

  return tokenName;

};