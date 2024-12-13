import React from "react";
import Pools from "views/StrategyManager/Pools";
import PoolDeposit from "views/StrategyManager/PoolDeposit";

const StrategyManagerPage: React.FC = () => {
  return (
    <div className="max-w-1117 mx-auto">
      <Pools />
      <PoolDeposit />
    </div>
  );
};
export default StrategyManagerPage;
