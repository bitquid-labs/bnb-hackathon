import { useEffect } from 'react';

import { VaultContract } from 'constants/contracts';

import { useAccount, useBlockNumber, useReadContract } from 'wagmi';
import { ICover, IVault } from 'types/common';
import { ChainType } from 'lib/wagmi';

export const useVaultDeposit = (vaultId: number) => {
  const { address, chain } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: vaultDepositData, refetch } = useReadContract({
    abi: VaultContract.abi,
    address: VaultContract.addresses[(chain as ChainType)?.chainNickName || 'bscTest'],
    functionName: 'getUserVaultDeposit',
    args: [vaultId, address],
  });

  useEffect(() => {
    refetch();
  }, [blockNumber]);

  console.log('vaultDepositData:', vaultId, vaultDepositData)

  if (!vaultDepositData) return undefined;

  try {
    const result = vaultDepositData as IVault;
    if (!result) return undefined;

    return result;
  } catch (error) {
    return undefined;
  }
};
