import IconWallet from "assets/icons/IconWallet";
import React from "react";
import InvestedStrategies from "./InvestedStrategies";
import InvestedPools from "./InvestedPools";

const InvestedOverview: React.FC = () => {
  return (
    <div className="w-full h-full border border-[#6B7280] rounded-20 bg-[#6B72801A] p-50">
      <InvestedStrategies />
      <InvestedPools />
    </div>
  )
}

export default InvestedOverview;