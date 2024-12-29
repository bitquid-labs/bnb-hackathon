import { useEffect } from 'react';

import { InsurancePoolContract, VaultContract } from 'constants/contracts';

import { useAccount, useBlockNumber, useReadContract } from 'wagmi';
import { ICover, IPool, IPoolInfo, IVault, IVaultDeposit } from 'types/common';
import { ChainType } from 'lib/wagmi';
import { bnToNumber } from 'lib/number';

type userDeposit = {
  vaults: IVaultDeposit[];
  pools: string
}

export const useVaultTVL = (vaultId: number) => {
  const { chain } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: tvl, refetch } = useReadContract({
    abi: VaultContract.abi,
    address: VaultContract.addresses[(chain as ChainType)?.chainNickName || 'bscTest'],
    functionName: 'getVaultTVL',
    args: [vaultId]
  });

  useEffect(() => {
    refetch();
  }, [blockNumber]);

  if (!tvl) return 0;

  try {
    const result = tvl as bigint;
    if (!result) return 0;

    return bnToNumber(result);
  } catch (error) {
    return 0;
  }
};
