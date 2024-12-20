import Button from "components/common/Button";
import React from "react";

type Props = {
  handleClaimYeild: () => void;
}

const PoolCard: React.FC<Props> = ({
  handleClaimYeild
}) => {
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
          wrapperClassName="w-full"
          className="w-full rounded-8 py-18 bg-gradient-to-r from-[#00ECBC66] to-[#00ECBC80] border border-[#00ECBC]">Withdraw Stake</Button>
        <Button 
          onClick={handleClaimYeild}
          wrapperClassName="w-full"
          className="w-full rounded-8 py-18 bg-gradient-to-r from-[#007ADF66] to-[#007ADF80] border border-[#007ADF]">Claim Yield</Button>
      </div>
    </div>
  )
}

export default PoolCard;