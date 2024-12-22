import React from "react";
import InvestedCovers from "views/MyAssets/Covers/InvestedCovers";
import InvestedPools from "views/MyAssets/Pools/InvestedPools";
import VaultsOverview from "views/MyAssets/Vaults/VaultsOverview";

const MyAssetsPage = () => {
  return (
    <div className="w-full max-w-1220 mx-auto pt-70">
      {/* <div className="flex justify-between items-stretch">
        <div className="w-[48%]">
          <StakedView />
        </div>
        <div className="w-[48%] h-full">
          <InvestedOverview />
        </div>
      </div> */}
      {/* <div className="w-full mt-80">
        <PoolsOverview />
      </div> */}
      {/* <InvestedCovers /> */}
      {/* <InvestedPools /> */}
      <VaultsOverview />
    </div>
  )
}

export default MyAssetsPage;