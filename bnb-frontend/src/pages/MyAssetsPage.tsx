import { cn } from "lib/utils";
import React, { useState } from "react";
import InvestedPools from "views/MyAssets/Pools/InvestedPools";
import VaultsOverview from "views/MyAssets/Vaults/VaultsOverview";

const MyAssetsPage = () => {
  const types = [
    "Pools",
    "Strategies",
  ];
  const [currentAsset, setCurretAsset] = useState(0);

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
      <div className="mx-auto w-320">
        <div className="flex w-full cursor-pointer items-center rounded border border-white/10 bg-white/5 p-[3px]">
          <div className="relative flex w-full cursor-pointer flex-col items-center rounded md:flex-row md:gap-0">
            {types.map((opt, index) => (
              <div
                key={index}
                className={cn(
                  "z-10 w-full py-12 text-center text-sm font-medium capitalize transition-all",
                  currentAsset === index
                    ? "text-white"
                    : "text-white/50 "
                )}
                onClick={() => setCurretAsset(index)}
              >
                <div
                  className={cn(
                    "flex justify-center border-r",
                    currentAsset === index
                      ? "border-white/10 "
                      : "border-transparent"
                  )}
                >
                  {opt}
                </div>
              </div>
            ))}
            <div
              className={cn(
                "absolute inset-y-0 hidden rounded bg-white/15 transition-all md:block"
              )}
              style={{
                width: `${100 / types.length}%`,
                transform: `translateX(${
                  (currentAsset === undefined ? 0 : currentAsset) *
                  100
                }%)`,
              }}
            />
            <div
              className={cn(
                "absolute inset-x-0 rounded bg-white/15 transition-all md:hidden"
              )}
              style={{
                height: `${100 / types.length}%`,
                transform: `translateY(${
                  (currentAsset === undefined ? 0 : currentAsset) *
                  100
                }%)`,
              }}
            />
          </div>
        </div>
      </div>
      <div className="mt-65">
        {
          currentAsset === 0 ? <InvestedPools /> : <VaultsOverview />
        }
      </div>
      {/* <VaultsOverview /> */}
    </div>
  );
};

export default MyAssetsPage;
