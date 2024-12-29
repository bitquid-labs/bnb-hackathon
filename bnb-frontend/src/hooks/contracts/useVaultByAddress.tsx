import { useEffect } from "react";

import { InsurancePoolContract, VaultContract } from "constants/contracts";

import { useAccount, useBlockNumber, useReadContract } from "wagmi";
import { ICover, IPool, IPoolInfo, IVault, IVaultDeposit } from "types/common";
import { ChainType } from "lib/wagmi";

type userDeposit = {
  vaults: IVaultDeposit[];
  pools: string;
};

export const useVaultByAddress = (address: string) => {
  const { chain } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: vaults, refetch } = useReadContract({
    abi: VaultContract.abi,
    address:
      VaultContract.addresses[(chain as ChainType)?.chainNickName || "bscTest"],
    functionName: "getUserVaultDeposits",
    args: [address],
  });

  useEffect(() => {
    refetch();
  }, [blockNumber]);

  if (!vaults)
    return {
      vaults: [],
      pools: [],
    };

  try {
    const result = vaults as any[];
    if (!result)
      return {
        vaults: [],
        pools: [],
      };

    return {
      vaults: result[0] as IVaultDeposit[],
      pools: result[1][0] as string[],
    };
  } catch (error) {
    return {
      vaults: [],
      pools: [],
    };
  }
};
