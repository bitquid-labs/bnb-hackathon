import React from "react";
import PoolCard from "./PoolCard";

const PoolsOverview: React.FC = () => {
  return (
    <div className="w-full">
      <div className="w-full flex relative items-center justify-center mb-52">
        <h2 className="z-10 text-center font-[600] text-30 text-[#FFF] bg-[#000] px-4">
          Invested Pools Overview
        </h2>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
      </div>
      <div className="w-full flex flex-col gap-30">
        <PoolCard />
        <PoolCard />
        <PoolCard />
      </div>
    </div>
  );
};

export default PoolsOverview;
