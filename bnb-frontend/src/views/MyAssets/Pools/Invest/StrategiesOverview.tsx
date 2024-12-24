import IconWallet from "assets/icons/IconWallet";
import React from "react";
import { PieChart } from "react-minimal-pie-chart";

const StrategiesOverview: React.FC = () => {
  return (
    <div>
      <div className="w-full flex items-center justify-start gap-5">
        <IconWallet />
        <span className="text-14 text-[#FFF] font-[500]">
          Invested Strategies
        </span>
      </div>
      <div className="w-full flex items-center justify-start gap-40 my-30">
        <div className="w-[40%]">
          <PieChart
            data={[
              { title: "One", value: 10, color: "#E38627" },
              { title: "Two", value: 15, color: "#C13C37" },
              { title: "Three", value: 20, color: "#6A2135" },
            ]}
          />
        </div>
        <div className="flex flex-col items-center justify-start gap-15">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-[#545454]"></div>
            <div className="text-14 font-[600]">Strategy #1</div>
          </div>
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-[#A6A6A6]"></div>
            <div className="text-14 font-[600]">Strategy #2</div>
          </div>
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-[#D9D9D9]"></div>
            <div className="text-14 font-[600]">Strategy #3</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategiesOverview;
