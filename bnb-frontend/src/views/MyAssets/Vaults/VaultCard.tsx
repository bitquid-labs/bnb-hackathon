import Button from "components/common/Button";
import React, { useState } from "react";
import { IVaultDeposit } from "types/common";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import useCallContract from "hooks/contracts/useCallContract";
import {
  ICoverContract,
  InsurancePoolContract,
  VaultContract,
} from "constants/contracts";
import { ChainType } from "lib/wagmi";
import { useVault } from "hooks/contracts/useVault";
import { bnToNumber } from "lib/number";
import { useTokenName } from "hooks/contracts/useTokenName";
import { useVaultTVL } from "hooks/contracts/useVaultTVL";

type VaultCardProps = {
  vaultDepositData: IVaultDeposit;
  pools: string[];
};

const VaultCard: React.FC<VaultCardProps> = ({ vaultDepositData, pools }) => {
  const { address, chain } = useAccount();
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [isClaimingLoading, setIsClaimingLoading] = useState<boolean>(false);
  const [isWithdrawLoading, setIsWithdrawLoading] = useState<boolean>(false);
  const { callContractFunction } = useCallContract();
  const vaultDetail = useVault(Number(vaultDepositData.vaultId));
  const assetTokenName = useTokenName(vaultDepositData.asset);
  const tvl = useVaultTVL(Number(vaultDepositData.vaultId));

  console.log("vaultDetail:", vaultDetail);

  console.log("vaultDepositData:", vaultDepositData);

  const handleClaimYeild = async () => {
    if (!vaultDepositData) return;

    const vaultId = Number(vaultDepositData.vaultId);
    console.log("poolDetail:", vaultDepositData, vaultId);

    setIsClaimingLoading(true);
    setLoadingMessage("Claiming");
    const params = [vaultId];

    try {
      await callContractFunction(
        ICoverContract.abi,
        ICoverContract.addresses[
          (chain as ChainType)?.chainNickName
        ] as `0x${string}`,
        "claimPayoutForVault",
        params,
        0n,
        () => {
          toast.success("Claim succeed!");
          setLoadingMessage("");
          setIsClaimingLoading(false);
        },
        () => {
          setLoadingMessage("");
          setIsClaimingLoading(false);
          toast.success("Failed to claim");
        }
      );

      // await writeContractAsync({
      //   abi: ICoverContract.abi,
      //   address: ICoverContract.addresses[
      //     (chain as ChainType)?.chainNickName
      //   ] as `0x${string}`,
      //   functionName: "claimPayoutForLP",
      //   args: params,
      // });
    } catch (error) {
      console.log("error:", error);
    }
  };

  const handleWithdrawStake = async () => {
    setIsWithdrawLoading(true);
    setLoadingMessage("Initiating");
    const params = [vaultDepositData.vaultId];

    try {
      await callContractFunction(
        VaultContract.abi,
        VaultContract.addresses[
          (chain as ChainType)?.chainNickName
        ] as `0x${string}`,
        "initialVaultWithdraw",
        params,
        0n,
        () => {
          toast.success("Withdraw Initiated");
          setLoadingMessage("");
          setIsWithdrawLoading(false);
        },
        () => {
          setLoadingMessage("");
          setIsWithdrawLoading(false);
          toast.success("Failed to withdraw initiate");
        }
      );

      setLoadingMessage("Withdrawing");
      await callContractFunction(
        InsurancePoolContract.abi,
        InsurancePoolContract.addresses[
          (chain as ChainType)?.chainNickName
        ] as `0x${string}`,
        "vaultWithdraw",
        params,
        0n,
        () => {
          toast.success("Withdraw Succeed");
          setLoadingMessage("");
          setIsWithdrawLoading(false);
        },
        () => {
          setLoadingMessage("");
          setIsWithdrawLoading(false);
          toast.success("Failed to withdraw");
        }
      );
    } catch (error) {
      console.log("error:", error);
    }
  };

  return (
    <div className="w-full flex items-center justify-between border border-[#6B7280] bg-[#6B72801A] py-24 px-27 rounded-10">
      <div className="bg-[#FFFFFF0D] border border-[#FFFFFF33] rounded-10 px-27 py-48 w-[70%]">
        <div className="grid grid-cols-3 gap-y-40">
          <div className="flex flex-col items-center justify-start gap-20">
            <div className="bg-[#FFFFFF0D] border border-[#FFFFFF1A] rounded-10 w-210 h-40 flex items-center justify-center">
              Strategy Name
            </div>
            <div className="">{vaultDetail?.vaultName}</div>
          </div>
          <div className="flex flex-col items-center justify-start gap-20">
            <div className="bg-[#FFFFFF0D] border border-[#FFFFFF1A] rounded-10 w-210 h-40 flex items-center justify-center">
              Staked Amount
            </div>
            <div className="">
              {bnToNumber(vaultDepositData?.amount)} {assetTokenName}
            </div>
          </div>
          <div className="flex flex-col items-center justify-start gap-20">
            <div className="bg-[#FFFFFF0D] border border-[#FFFFFF1A] rounded-10 w-210 h-40 flex items-center justify-center">
              APY
            </div>
            <div className="">{Number(vaultDepositData?.vaultApy)} %</div>
          </div>
          <div className="flex flex-col items-center justify-start gap-20">
            <div className="bg-[#FFFFFF0D] border border-[#FFFFFF1A] rounded-10 w-210 h-40 flex items-center justify-center">
              Pools Invested
            </div>
            <div className="flex flex-col justify-center gap-4 items-cetnter">
              {pools.map((pool, index) => (
                <span className="text-center text-12">{pool}</span>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center justify-start gap-20">
            <div className="bg-[#FFFFFF0D] border border-[#FFFFFF1A] rounded-10 w-210 h-40 flex items-center justify-center">
              TVL
            </div>
            <div className="">
              {tvl.toFixed(2)} {"USD"}
            </div>
          </div>
          <div className="flex flex-col items-center justify-start gap-20">
            <div className="bg-[#FFFFFF0D] border border-[#FFFFFF1A] rounded-10 w-210 h-40 flex items-center justify-center">
              Tenure Period
            </div>
            <div className="">
              {Math.round(
                Math.abs(
                  Number(vaultDepositData?.startDate) -
                    Number(vaultDepositData?.expiryDate)
                ) /
                  (60 * 60 * 24)
              )}{" "}
              Days
            </div>
          </div>
        </div>
      </div>
      <div className="w-[27%] flex flex-col items-center justify-center gap-50">
        <Button
          isLoading={isWithdrawLoading}
          onClick={handleWithdrawStake}
          wrapperClassName="w-full"
          className="w-full rounded-8 py-18 bg-gradient-to-r from-[#00ECBC66] to-[#00ECBC80] border border-[#00ECBC]"
        >
          Withdraw Stake
        </Button>
        <Button
          isLoading={isClaimingLoading}
          onClick={handleClaimYeild}
          wrapperClassName="w-full"
          className="w-full rounded-8 py-18 bg-gradient-to-r from-[#007ADF66] to-[#007ADF80] border border-[#007ADF]"
        >
          {isClaimingLoading ? loadingMessage : "Claim Yield"}
        </Button>
      </div>
    </div>
  );
};

export default VaultCard;
