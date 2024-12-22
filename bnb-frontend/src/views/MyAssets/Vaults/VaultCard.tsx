import Button from "components/common/Button";
import React, { useState } from "react";
import { IVaultDeposit } from "types/common";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import useCallContract from "hooks/contracts/useCallContract";
import { VaultContract } from "constants/contracts";
import { ChainType } from "lib/wagmi";

type VaultCardProps = {
  vaultId: number;
  vaultData: IVaultDeposit;
};

const VaultCard: React.FC<VaultCardProps> = ({
  vaultId,
  vaultData
}) => {
  const { address, chain } = useAccount();
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [isClaimingLoading, setIsClaimingLoading] = useState<boolean>(false);
  const [isWithdrawLoading, setIsWithdrawLoading] = useState<boolean>(false);
  const { callContractFunction } = useCallContract();
  
  const handleClaimYeild = async () => {

  }

  const handleWithdrawStake = async () => {
    setIsWithdrawLoading(true);
    setLoadingMessage("Withdrawing...");
    const params = [vaultId];

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
          toast.success("Withdraw Initiated")
          setLoadingMessage("")
          setIsWithdrawLoading(false);
        },
        () => {
          setLoadingMessage("")
          setIsWithdrawLoading(false);
          toast.success("Failed to withdraw initiate")
        }
      );


      await callContractFunction(
        VaultContract.abi,
        VaultContract.addresses[
          (chain as ChainType)?.chainNickName
        ] as `0x${string}`,
        "initialVaultWithdraw",
        params,
        0n,
        () => {
          toast.success("Withdraw Initiated")
          setLoadingMessage("")
          setIsWithdrawLoading(false);
        },
        () => {
          setLoadingMessage("")
          setIsWithdrawLoading(false);
          toast.success("Failed to withdraw initiate")
        }
      );
    } catch (error) {
      console.log("error:", error);
    }
  }
  
  return (
    <div className="w-full flex items-center justify-between border border-[#6B7280] bg-[#6B72801A] py-24 px-27 rounded-10">
      <div className="bg-[#FFFFFF0D] border border-[#FFFFFF33] rounded-10 px-27 py-48 w-[70%]">
        <div className="grid grid-cols-3 gap-y-40">
          <div className="flex flex-col items-center justify-center gap-20">
            <div className="bg-[#FFFFFF0D] border border-[#FFFFFF1A] rounded-10 w-210 h-40 flex items-center justify-center">Pool Name</div>
            <div className="">Pool1</div>
          </div>
          <div className="flex flex-col items-center justify-center gap-20">
            <div className="bg-[#FFFFFF0D] border border-[#FFFFFF1A] rounded-10 w-210 h-40 flex items-center justify-center">Staked Amount</div>
            <div className="">Pool1</div>
          </div>
          <div className="flex flex-col items-center justify-center gap-20">
            <div className="bg-[#FFFFFF0D] border border-[#FFFFFF1A] rounded-10 w-210 h-40 flex items-center justify-center">Staked Amount</div>
            <div className="">Pool1</div>
          </div>
          <div className="flex flex-col items-center justify-center gap-20">
            <div className="bg-[#FFFFFF0D] border border-[#FFFFFF1A] rounded-10 w-210 h-40 flex items-center justify-center">Risk</div>
            <div className="">Pool1</div>
          </div>
          <div className="flex flex-col items-center justify-center gap-20">
            <div className="bg-[#FFFFFF0D] border border-[#FFFFFF1A] rounded-10 w-210 h-40 flex items-center justify-center">Tenure Period</div>
            <div className="">Pool1</div>
          </div>
          <div className="flex flex-col items-center justify-center gap-20">
            <div className="bg-[#FFFFFF0D] border border-[#FFFFFF1A] rounded-10 w-210 h-40 flex items-center justify-center">Yield Returns</div>
            <div className="">Pool1</div>
          </div>
        </div>
      </div>
      <div className="w-[27%] flex flex-col items-center justify-center gap-50">
        <Button
          isLoading={isWithdrawLoading}
          onClick={handleWithdrawStake}
          wrapperClassName="w-full"
          className="w-full rounded-8 py-18 bg-gradient-to-r from-[#00ECBC66] to-[#00ECBC80] border border-[#00ECBC]">Withdraw Stake</Button>
        <Button 
          isLoading={isClaimingLoading}
          onClick={handleClaimYeild}
          wrapperClassName="w-full"
          className="w-full rounded-8 py-18 bg-gradient-to-r from-[#007ADF66] to-[#007ADF80] border border-[#007ADF]">
          {isClaimingLoading ? loadingMessage : "Claim Yield"}
        </Button>
      </div>
    </div>
  )
}

export default VaultCard;