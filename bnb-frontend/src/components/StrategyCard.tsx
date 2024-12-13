import React, { useState } from "react";
import BlueUSDC from "../assets/images/blue-usdc.png";
import USDCIcon from "assets/images/usdc.png";
import IconClock from "assets/icons/IconClock";
import IconInfo from "assets/images/icon-info.png";

type StrategyCardProps = {};

const StrategyCard: React.FC<StrategyCardProps> = () => {
  const [coverAmount, setCoverAmount] = useState<string>("");
  const handleCoverAmountChange = (e: any) => {};

  return (
    <div className="flex flex-col gap-16">
      <div className="px-27 py-25 rounded-19 bg-gradient-to-b from-[#00ECBC99] to-[#0B050F] text-[#FFF] border border-[#00ECBC]">
        <div className="flex justfy-center items-center gap-25">
          <div className="flex flex-col">
            <div className="text-16">Strategy Name</div>
            <div className="font-[700] text-47">5%</div>
            <div className="text-16">Enter Amount</div>
          </div>
          <div className="">
            <img className="" src={BlueUSDC} alt="" />
          </div>
        </div>
        <div className="w-full mt-5 bg-[#07040D] flex items-center justify-center rounded-12 py-7 px-12">
          <img src={USDCIcon} alt="usdc" />
          <input
            className="ml-5 bg-transparent placeholder:text-light/50 min-w-0 flex-auto border-none p-0 px-3 focus:border-none focus:outline-none focus:outline-offset-0 focus:ring-0"
            placeholder="Enter Amount"
            value={coverAmount || ""}
            onChange={(e) => handleCoverAmountChange(e)}
          />
          <span className="text-8">MAX</span>
        </div>
        <div className="w-full mt-12 flex justify-between items-center py-7 px-10 rounded-8 border border-[#00ECBC]">
          <IconClock />
          <span className="text-12 font-[600] text-[#FFF]">
            Tenure Period: 45 Days
          </span>
          <img src={IconInfo} alt="info icon" />
        </div>
        <button className="w-full py-12 px-60 border border-[#6B7280] rounded-10 mt-14 bg-[#6B728066]">
          STAKE NOW
        </button>
        <div className="my-12 flex flex-col gap-16">
          <div className="flex justify-between items-center">
            <span className="text-[#8D8D8D] text-12 font-[500]">
              Min Investment:
            </span>
            <span className="text-[#FFF] font-[600]">15 USD</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#8D8D8D] text-12 font-[500]">
              TVL of Strategy:
            </span>
            <span className="text-[#FFF] font-[600]">10K USD</span>
          </div>
        </div>
      </div>
      <div className="flex items-center p-6 mx-auto bg-[#FFFFFF0D] border border-[#FFFFFF1A] rounded-4">
        <div className="px-24 text-[#FFF]">More Details</div>
        <div className="">
          <img src={IconInfo} alt="info icon" />
        </div>
      </div>
    </div>
  );
};

export default StrategyCard;
