import React from "react";
import IconWallet from "assets/icons/IconWallet";
import IconPoolClock from "assets/icons/IconPoolClock";
import IconYieldChart from "assets/icons/IconYieldChart";
import IconAsset from "assets/icons/IconAssetDistribution";

const StakedView: React.FC = () => {
  return (
    <div className="w-full border border-[#6B7280] rounded-20 bg-[#6B72801A] p-50">
      <div className="w-full flex items-center justify-start gap-5">
        <IconWallet />
        <span className="text-14 text-[#FFF] font-[500]">
          Total Value Staked
        </span>
      </div>
      <div className="mt-12 text-32 font-[500] text-[#00ECBC99]">
        $21.226,00SD
      </div>
      <div className="w-full flex items-center justify-start">
        <div className="flex flex-col w-1/2">
          <div className="text-[#C4C4C4] flex items-center gap-5">
            <IconPoolClock />
            <span>Pool Duration</span>
          </div>
          <span>$19.47M</span>
        </div>
        <div className="flex flex-col w-1/2">
          <div className="text-[#C4C4C4] flex items-center gap-5">
            <IconYieldChart />
            <span>Yield %</span>
          </div>
          <span>0.72M</span>
        </div>
      </div>
      <div className="w-full mt-20">
        <div className="flex items-center gap-4">
          <IconAsset />
          <span className="text-14 text-[#C4C4C4]">Asset Distribution</span>
        </div>
        <div className="">
          <div className="flex items-center gap-7 mt-10">
            <div className="w-[40%] h-22 bg-gradient-to-b from-[#00ECBC4D] to-[#00ECBCB2]"></div>
            <div className="text-10 font-[600]">Investment Arm</div>
          </div>
          <div className="flex items-center gap-7 mt-10">
            <div className="w-[70%] h-22 bg-gradient-to-r from-[rgba(255,197,49,0.24)] via-[rgba(255,197,49,0.36)] to-[rgba(255,197,49,0.48)]"></div>
            <div className="text-10 font-[600]">Cover Purchases</div>
          </div>
          <div className="flex items-center gap-7 mt-10">
            <div className="w-[30%] h-22 bg-[#90B0DF99]"></div>
            <div className="text-10 font-[600]">Restaking Earnings</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakedView;
