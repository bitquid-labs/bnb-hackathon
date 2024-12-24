import IconWallet from "assets/icons/IconWallet";
import React from "react";
import { PieChart } from "react-minimal-pie-chart";

const PoolsOverview: React.FC = () => {
  return (
    <div>
      <div className="w-full flex items-center justify-start gap-5">
        <IconWallet />
        <span className="text-14 text-[#FFF] font-[500]">
          Invested Pools
        </span>
      </div>
      <div className="flex flex-wrap p-20">
        <div className="w-1/2 flex">
          <div className="w-12 h-12 mt-4 rounded-4 bg-[#B09FFF]"></div>
          <div className="flex flex-col justify-start items-center gap-4 pl-8">
            <span className="text-12 font-[500]">AAA</span>
            <span className="text-12 font-[600]">65%</span>
          </div>
        </div>
        <div className="w-1/2 flex">
          <div className="w-12 h-12 mt-4 rounded-4 bg-[#007ADF]"></div>
          <div className="flex flex-col justify-start items-center gap-4 pl-8">
            <span className="text-12 font-[500]">C</span>
            <span className="text-12 font-[600]">15%</span>
          </div>
        </div>
        <div className="w-1/2 flex">
          <div className="w-12 h-12 mt-4 rounded-4 bg-[#00ECBC]"></div>
          <div className="flex flex-col justify-start items-center gap-4 pl-8">
            <span className="text-12 font-[500]">BB</span>
            <span className="text-12 font-[600]">28%</span>
          </div>
        </div>
        <div className="w-1/2 flex">
          <div className="w-12 h-12 mt-4 rounded-4 bg-[#727272]"></div>
          <div className="flex flex-col justify-start items-center gap-4 pl-8">
            <span className="text-12 font-[500]">A</span>
            <span className="text-12 font-[600]">2%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolsOverview;
