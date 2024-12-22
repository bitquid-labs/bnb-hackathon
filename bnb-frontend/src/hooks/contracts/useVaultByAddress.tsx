import { useEffect } from 'react';

import { InsurancePoolContract, VaultContract } from 'constants/contracts';

import { useAccount, useBlockNumber, useReadContract } from 'wagmi';
import { ICover, IPool, IPoolInfo, IVault } from 'types/common';
import { ChainType } from 'lib/wagmi';

export const useVaultByAddress = (address: string) => {
  const { chain } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: vaults, refetch } = useReadContract({
    abi: VaultContract.abi,
    address: VaultContract.addresses[(chain as ChainType)?.chainNickName || 'bscTest'],
    functionName: 'userVaultDeposits',
    args: [address]
  });

  useEffect(() => {
    refetch();
  }, [blockNumber]);

  console.log('vaultData:', vaults, address)

  if (!vaults) return [];

  try {
    const result = vaults as IPoolInfo[];
    if (!result) return [];

    return result;
  } catch (error) {
    return [];
  }
};
