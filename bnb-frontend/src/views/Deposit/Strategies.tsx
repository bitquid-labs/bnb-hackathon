import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import StrategyCard from "./StrategyCard";
import { useAllVaults } from "hooks/contracts/useAllVaults";
const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const Strategies: React.FC = () => {
  const vaults = useAllVaults();

  return (
    <div className="w-full">
      <Carousel responsive={responsive}>
        {vaults.map((vault, index) => {
          return (
            <StrategyCard
              id={Number(vault.id)}
              name={vault.vaultName || ''}
              minInvestment={Number(vault.minInv) || 0}
              tenurePeriod={Number(vault.minPeriod) || 0}
              tvl={1500}
            />
          )
        })}
        {/* <StrategyCard />
        <StrategyCard />
        <StrategyCard />
        <StrategyCard />
        <StrategyCard />
        <StrategyCard /> */}
      </Carousel>
    </div>
  );
};

export default Strategies;
