import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import VaultCard from "./VaultCard";
import { useAllVaults } from "hooks/contracts/useAllVaults";
import { scrollToTop } from "lib/utils";
import { useVaultTVL } from "hooks/contracts/useVaultTVL";
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

type Props = {
  currentVaultId: number | undefined;
  setCurrentVaultId: (newVal: number) => void
}

const VaultList: React.FC<Props> = ({currentVaultId, setCurrentVaultId}) => {
  const vaults = useAllVaults();

  return (
    <div className="w-full">
      <Carousel responsive={responsive} containerClass="justify-center">
        {vaults.map((vault, index) => {
          return (
            <VaultCard
              apy={Number(vault.apy)}
              key={index}
              id={Number(vault.id)}
              name={vault.vaultName || ''}
              riskType={vault.risk || 0}
              tenurePeriod={Number(vault.minPeriod) || 0}
              handleStake={() => {
                scrollToTop();
                setCurrentVaultId(Number(vault.id))
              }}
            />
          )
        })}
      </Carousel>
    </div>
  );
};

export default VaultList;
