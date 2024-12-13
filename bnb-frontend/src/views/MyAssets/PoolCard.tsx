import React from "react";

const PoolCard: React.FC = () => {
  return (
    <div className="w-full bg-[#6B72801A] border border-[#6B7280] rounded-20 py-24 px-25 flex items-center justify-between">
      <div className="w-[70%] flex flex-wrap items-center justify-between bg-[#FFFFFF0D] border border-[#FFFFFF33] rounded-10 py-48 px-27 gap-15 gap-y-40">
        <div className="w-[25%] flex flex-col justify-center items-center gap-20 ">
          <div className="bg-[#FFFFFF0D] border border-[#FFFFFF1A] rounded-10 px-40 py-7">
            Strategy Name
          </div>
          <div className="text-18 font-[600]">Contract Risk</div>
        </div>
        <div className="w-[25%] flex flex-col justify-center items-center gap-20 ">
          <div className="bg-[#FFFFFF0D] border border-[#FFFFFF1A] rounded-10 px-40 py-7">
            Strategy Name
          </div>
          <div className="text-18 font-[600]">Contract Risk</div>
        </div>
        <div className="w-[25%] flex flex-col justify-center items-center gap-20 ">
          <div className="bg-[#FFFFFF0D] border border-[#FFFFFF1A] rounded-10 px-40 py-7">
            Strategy Name
          </div>
          <div className="text-18 font-[600]">Contract Risk</div>
        </div>
        <div className="w-[25%] flex flex-col justify-center items-center gap-20 ">
          <div className="bg-[#FFFFFF0D] border border-[#FFFFFF1A] rounded-10 px-40 py-7">
            Strategy Name
          </div>
          <div className="text-18 font-[600]">Contract Risk</div>
        </div>
        <div className="w-[25%] flex flex-col justify-center items-center gap-20 ">
          <div className="bg-[#FFFFFF0D] border border-[#FFFFFF1A] rounded-10 px-40 py-7">
            Strategy Name
          </div>
          <div className="text-18 font-[600]">Contract Risk</div>
        </div>
        <div className="w-[25%] flex flex-col justify-center items-center gap-20 ">
          <div className="bg-[#FFFFFF0D] border border-[#FFFFFF1A] rounded-10 px-40 py-7">
            Strategy Name
          </div>
          <div className="text-18 font-[600]">Contract Risk</div>
        </div>
      </div>
      <div className="w-[30%]">
        <div className="w-full flex flex-col pl-25 gap-50">
          <button className="px-70 py-18 border border-[#00ECBC] rounded-8 bg-gradient-to-r from-[#00ECBC66] to-[#00ECBC80] text-white font-medium hover:opacity-90">
            Withdraw Stake
          </button>
          <button className="px-70 py-18 border border-[#007ADF] rounded-8 bg-gradient-to-r from-[#007ADF66] to-[#007ADF80] text-white font-medium hover:opacity-90">
            Claim Yield
          </button>
        </div>
      </div>
    </div>
  );
};

export default PoolCard;
