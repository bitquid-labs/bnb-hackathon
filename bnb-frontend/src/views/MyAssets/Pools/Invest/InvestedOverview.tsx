import IconWallet from "assets/icons/IconWallet";
import React from "react";
import StrategiesOverview from "./StrategiesOverview";
import PoolsOverview from "./PoolsOverview";

const InvestedOverview: React.FC = () => {
  return (
    <div className="w-full h-full border border-[#6B7280] rounded-20 bg-[#6B72801A] p-50">
      <StrategiesOverview />
      <PoolsOverview />
    </div>
  )
}

export default InvestedOverview;