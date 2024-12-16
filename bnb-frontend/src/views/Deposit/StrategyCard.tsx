import React from "react";

type VaultCardType = {
  name: string,
  minInvestment: number,
  tenurePeriod: number,
  tvl: number,
}

const StrategyCard: React.FC<VaultCardType> = ({
  name,
  minInvestment,
  tenurePeriod,
  tvl,
}) => {
  const APY = '5-7'
  return (
    <div className="rounded-30 p-27 relative border border-[#00ECBC] overflow-hidden bg-gradient-to-b from-[#05050500] to-[#00ECBC4D] mx-15">
      <div className="absolute inset-0 backdrop-blur-md bg-black/50"></div>
      <div className="relative z-[10]">
        <span className="text-14 font-[700] text-[#00ECBC]">{name}</span>
      </div>
      <div className="relative z-[10]">
        <span className="font-[700] text-35">{APY}%</span>
        <span className="text-15 ml-8">APY</span>
      </div>
      <div className="relative z-[10] w-full h-1 bg-gradient-to-r from-[#00ECBC1A] via-[#00ECBC] to-[#00ECBC1A] my-12"></div>
      <div className="relative z-[10] mb-7">
        <div className="text-[#9DA3BA] text-13 font-[500] mb-10">Min Investment</div>
        <div className="flex items-end">
          <span className="text-[#00ECBC] text-24 font-[700] leading-[25px]">{minInvestment}</span>
          <span className="text-[#FFF] text-12 ml-4">USD</span>
        </div>
      </div>
      <div className="relative z-[10] mb-7">
        <div className="text-[#9DA3BA] text-13 font-[500] mb-10">Tenure Period</div>
        <div className="flex items-end">
          <span className="text-[#00ECBC] text-24 font-[700] leading-[25px]">{tenurePeriod}</span>
          <span className="text-[#FFF] text-12 ml-4">Days</span>
        </div>
      </div>
      <div className="relative z-[10] mb-20">
        <div className="text-[#9DA3BA] text-13 font-[500] mb-10">TVL of Strategy</div>
        <div className="flex items-end">
          <span className="text-[#00ECBC] text-24 font-[700] leading-[25px]">{tvl}</span>
          <span className="text-[#FFF] text-12 ml-4">USD</span>
        </div>
      </div>
      <div className="w-full relative z-[10]">
        <button className="w-full py-8 bg-[#000000CC] border border-[#FFFFFF] rounded-9">STAKE NOW</button>
      </div>
    </div>
  )
}

export default StrategyCard;