import React from "react";

import { Slider } from "components/Slider";

import poolDetailIcon from "assets/images/pool_detail.png";
import networkBOBIcon from "assets/images/network_bob.png";
import networkBSCIcon from "assets/images/network_bsc.png";
import IconArrow from "assets/icons/IconArrow";

const PoolDeposit: React.FC = () => {
  return (
    <div className="w-full">
      <div className="flex items-center">
        <img src={poolDetailIcon} className="w-25 h-25" alt="poo_detail" />
        <h2 className="text-30 font-600 text-white pl-10">Pool #2</h2>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center text-white">
          <div className="border border-[#6B7280] rounded-10 bg-[#FFFFFF0D] py-12 px-20">
            APY: 3~5%
          </div>
          <div className="flex items-center justify-center border border-[#6B7280] rounded-10 bg-[#FFFFFF0D] py-12 px-20">
            <img src={networkBOBIcon} className="w-25 h-24" alt="network_bob" />
            <span className="pl-4">BOB Chain</span>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-between mt-10">
        <div className="w-[60%] p-24 bg-[#FFFFFF0D] border border-[#FFFFFF33] rounded-10">
          <div className="w-full">
            <div className="flex w-full max-w-[300px] items-center rounded-[10px] border border-white p-[2px]">
              <div className="relative flex w-full flex-col items-center rounded-lg md:flex-row md:gap-0">
                {["Stake", "Unstake"].map((opt, index) => (
                  <div
                    key={index}
                    className="z-10 w-full py-2 text-center text-base capitalize text-white transition-all"
                    // onClick={() => setSelectedType(index)}
                  >
                    {opt}
                  </div>
                ))}
                <div
                  className="absolute inset-y-0 hidden rounded-lg border border-[#00ECBC] bg-[#00ECBC]/10 transition-all md:block"
                  style={{
                    width: `50%`,
                    transform: `translateX(100%)`,
                  }}
                />
                <div
                  className="absolute inset-x-0 rounded-lg border border-[#00ECBC] bg-[#00ECBC]/10 transition-all md:hidden"
                  style={{
                    height: `50%`,
                    // transform: `translateY(${selectedType * 100}%)`,
                  }}
                />
              </div>
            </div>
            <div className="w-full flex items-center justify-between mt-50">
              <div className="">
                <span className="text-15 text-white">Balance: </span>
                <span className="text-15 text-white">22.52</span>
              </div>
              <div className="flex items-center gap-12">
                <div className="px-10 rounded-5 border border-[#FFFFFF33] bg-[#FFFFFF0D] text-[#858585]">
                  25%
                </div>
                <div className="px-10 rounded-5 border border-[#FFFFFF33] bg-[#FFFFFF0D] text-[#858585]">
                  50%
                </div>
                <div className="px-10 rounded-5 border border-[#FFFFFF33] bg-[#FFFFFF0D] text-[#858585]">
                  MAX
                </div>
              </div>
            </div>
            <div className="w-full flex items-center justify-between">
              <div className="text-25 font-[500]">3.197</div>
              <div className="flex justify-center items-center">
                <span className="text-15 font-[300]">BNB</span>
                <div className="flex">
                  <img src={networkBSCIcon} alt="bsc" className="w-20 h-20" />
                </div>
              </div>
            </div>
            <div className="w-full flex items-center justify-between">
              <span className="text-12 text-[#C0C0C0] font-[400]">
                ≈$ 639.58
              </span>
              <span className="text-12 text-[#C0C0C0] font-[600]">
                Transaction Fee
              </span>
            </div>
            <div className="w-full flex items-center justify-start my-10">
              <span className="text-14 font-[600]">LIT Token Assigned:</span>
              <span className="text-14 font-[600]">15.6</span>
            </div>
            <div className="w-full">
              <button className="bg-[#00ECBC66] border border-[#00ECBC] px-45 py-7 rounded-8 w-full">
                Deposit
              </button>
            </div>
          </div>
        </div>
        <div className="w-[39%] p-24 bg-[#FFFFFF0D] border border-[#FFFFFF33] rounded-10">
          <div className="flex items-center justify-start gap-20">
            <div className="text-15 font-[600]">Risk Type:</div>
            <div className="border border-[#00ECBC] bg-[#00ECBC0D] rounded-8 px-24 py-4">
              Low
            </div>
          </div>
          <div className="flex w-full">
            <div className="flex flex-col gap-[13px] w-full">
              <div className="flex items-center mt-40 justify-between">
                <div className="flex gap-[10px]">
                  <div className="text-15 font-[600]">Tenure Period</div>
                </div>
              </div>
              <div className="w-full flex items-center justify-between">
                <div className="flex h-auto w-120 rounded-8 border border-[#6D6D6D] px-1 py-2">
                  <input
                    className="pl-10 placeholder:text-light/50 min-w-0 flex-auto border-none bg-transparent p-0 px-3 focus:border-none focus:outline-none focus:outline-offset-0 focus:ring-0"
                    readOnly
                    value={50}
                    onChange={
                      (e) => {}
                      // handleCoverPeriodChange(
                      //   Math.max(
                      //     MIN_COVER_PERIOD,
                      //     Math.min(MAX_COVER_PERIOD, Number(e.target.value))
                      //   )
                      // )
                    }
                  />
                  <div className="h-[36px] rounded-[10px] bg-[#131313] px-[10px] py-4 text-center text-[10px] leading-[24px] text-white">
                    Days
                  </div>
                </div>
                <div className="flex w-[200px] flex-col gap-3">
                  <Slider
                    rangeClassName="bg-[#00ECBC] h-[4px]"
                    thumbClassName="h-[14px] w-[14px]"
                    trackClassName="h-[4px]"
                    defaultValue={[50]}
                    value={[50]}
                    onValueChange={(val) => {
                      // handleCoverPeriodChange(val[0]);
                    }}
                    min={28}
                    max={250}
                    step={1}
                  />
                  <div className="flex justify-between px-3">
                    <div>28 Days</div>
                    <IconArrow className="w-6" />
                    <div>365 Days</div>
                  </div>
                </div>
              </div>
              <div className="">
                <span className="text-15 font-[600]">Rewards (by $0)</span>
              </div>
              <div className="flex w-full items-start justify-between">
                <div className="flex flex-col h-full items-center justify-between gap-5">
                  <div className="text-15 font-[600]">Selected Strategy</div>
                  <div className="bg-[#00ECBC1A] px-40 py-5 rounded-10">
                    Vesting
                  </div>
                </div>
                <div className="flex flex-col h-full items-center justify-between gap-5">
                  <span className="text-15 font-[600]">Per week</span>
                  <span className="text-15 font-[600] py-5">xx %</span>
                </div>
                <div className="flex flex-col h-full items-center justify-between gap-5">
                  <span className="text-15 font-[600]">Per month</span>
                  <span className="text-15 font-[600] py-5">xx %</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolDeposit;
