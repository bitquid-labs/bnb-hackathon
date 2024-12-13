import React from "react";
import InvestedOverview from "views/MyAssets/InvestedOverview";
import PoolsOverview from "views/MyAssets/PoolsOverview";
import StakedView from "views/MyAssets/StakedView";

const MyAssetsPage = () => {
  return (
    <div className="w-full max-w-1220 mx-auto pt-70">
      <div className="flex justify-between items-stretch">
        <div className="w-[48%]">
          <StakedView />
        </div>
        <div className="w-[48%] h-full">
          <InvestedOverview />
        </div>
      </div>
      <div className="w-full mt-80">
        <PoolsOverview />
      </div>
    </div>
  )
}

export default MyAssetsPage;