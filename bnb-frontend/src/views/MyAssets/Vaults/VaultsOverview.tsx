import SectionTitle from "components/common/SectionTitle";
import { useVaultByAddress } from "hooks/contracts/useVaultByAddress";
import React from "react";
import { useAccount } from "wagmi";
import VaultCard from "./VaultCard";

const VaultsOverview: React.FC = () => {
  const { address } = useAccount();
  const { vaults: userVaults, pools } = useVaultByAddress(address as string);

  return (
    <div className="w-full">
      <SectionTitle title="Invested Strategies Overview" />
      <div className="mt-52">
        {userVaults.map((vault, index) => (
          <VaultCard key={index} vaultDepositData={vault} pools={pools} />
        ))}
      </div>
    </div>
  );
};

export default VaultsOverview;
