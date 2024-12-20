import { useAllPools } from "hooks/contracts/useAllPools";
import React from "react";
import InvestedOverview from "views/MyAssets/InvestedOverview";
import PoolsOverview from "views/MyAssets/PoolsOverview";
import StakedView from "views/MyAssets/StakedView";
import { useAccount } from "wagmi";
import { usePoolByAddress } from "hooks/contracts/usePoolByAddress";
import InvestedCovers from "views/MyAssets/Covers/InvestedCovers";
import { useAllUserCovers } from "hooks/contracts/useAllUserCovers";

const MyAssetsPage = () => {
  const {address} = useAccount();

  const userPools = usePoolByAddress(address as string);
  console.log('user pools:', userPools)
  const allPools = useAllPools();

  const userCovers = useAllUserCovers(address as string);
  console.log('user covers:', userCovers)

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
      <InvestedCovers />
    </div>
  )
}

export default MyAssetsPage;