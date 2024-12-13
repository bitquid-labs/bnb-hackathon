import React, { useState } from "react";
import SwitchComponent from "components/Switch";
import StrategyCard from "components/StrategyCard";

const RiskCards: React.FC = () => {
  const [selectedRisk, setSelectedRisk] = useState<number>(0);
  const handleSwitch = () => {}


  return (
    <div className="flex flex-col justify-center items-center pt-40">
      <div className="w-full flex flex-col items-center">
        <p className="font-[600] text-30 text-[#FFF] leading-[30px]">
          Explore BQ Labs DeFi Yield aggregation
        </p>
        <p className="font-[600] text-30 text-[#FFF] leading-[30px]">
          through Risk Economy
        </p>
      </div>
      <div>
        <SwitchComponent
          options={["Low Risk", "Moderate Risk", "High Risk"]}
          value={selectedRisk}
          handleSwitch={handleSwitch}
        />
      </div>
      <div className="flex justify-between mt-40 gap-20">
        <StrategyCard />
        <StrategyCard />
        <StrategyCard />
      </div>
    </div>
  );
};

export default RiskCards;
