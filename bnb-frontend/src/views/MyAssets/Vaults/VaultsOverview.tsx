import SectionTitle from "components/common/SectionTitle"
import { useVaultByAddress } from "hooks/contracts/useVaultByAddress"
import React from "react"
import { useAccount } from "wagmi"

const VaultsOverview: React.FC = () => {
  const {address} = useAccount();
  const depositVaults = useVaultByAddress(address as string);
  return (
    <div className="w-full">
      <SectionTitle title="Invested Pools Overview" />
      <div className="mt-52"></div>
    </div>
  )
}

export default VaultsOverview