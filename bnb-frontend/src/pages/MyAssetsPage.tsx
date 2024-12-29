import { cn } from "lib/utils";
import React, { useState } from "react";
import InvestedPools from "views/MyAssets/Pools/InvestedPools";
import VaultsOverview from "views/MyAssets/Vaults/VaultsOverview";
import metamask from "../assets/images/metamask.svg";
import btc from "../assets/images/bitcoin.svg";

const MyAssetsPage = () => {
  const types = [
    "Pools",
    "Strategies",
  ];
  const [currentAsset, setCurretAsset] = useState(0);

  return (
    <div className=" w-[80%] mx-auto pt-70">
      <div className="flex gap-16 bg-black text-white p-6 mb-44">
        {/* First Card */}
        <div className="glass rounded-2xl shadow-lg p-6 w-[80%] px-40 py-32 space-y-56">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-sm text-gray-400">Your Wallet:</p>
              <div className="flex items-center gap-5 justify-center mt-10">
                <img src={metamask} alt="" />
                <p className="text-xl font-bold">0EX030...023</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400">Wallet Balance:</p>
              <div className="flex items-center gap-5 justify-center mt-10">
                <img src={btc} alt="" />
                <p className="text-xl font-bold text-orange-400">$10,000.2</p>
              </div>
            </div>
          </div>
          <div className="mb-6">
            <p className="text-sm text-gray-400">Total Value Staked</p>
            <p className="text-3xl font-bold text-green-400">$21,226.00 USD</p>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-400">Pool Duration</p>
              <p className="text-lg font-bold">$19.47M</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Yield %</p>
              <p className="text-lg font-bold">$0.72M</p>
            </div>
          </div>
        </div>

        {/* Second Card */}
        <div className="glass rounded-2xl shadow-xl p-6 w-[80%] px-40 py-32 ">
          <p className="text-sm text-gray-400 mb-10">Invested Strategies</p>
          <div className="flex flex-col items-center">

            <div className="flex justify-start items-center w-full">
              <div className="w-[60%] flex justify-center items-center overflow-visible">
                <div className="relative w-[14rem] h-[14rem]">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 46 46"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="23"
                      cy="23"
                      r="15"
                      fill="transparent"
                      stroke="#444"
                      strokeWidth="9"
                    ></circle>
                    <circle
                      cx="23"
                      cy="23"
                      r="15"
                      fill="transparent"
                      stroke="#fff"
                      strokeWidth="9"
                      strokeDasharray="70,100"
                      strokeDashoffset="25"
                    ></circle>
                    <circle
                      cx="23"
                      cy="23"
                      r="15"
                      fill="transparent"
                      stroke="#999"
                      strokeWidth="9"
                      strokeDasharray="50,100"
                      strokeDashoffset="60"
                    ></circle>
                  </svg>
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-xl bg-gray-400"></div>
                  <p className="font-semibold">Strategy 1</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-xl bg-gray-400"></div>
                  <p className="font-semibold">Strategy 2</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-xl bg-gray-400"></div>
                  <p className="font-semibold">Strategy 3</p>
                </div>
              </div>
            </div>

            <div className="w-1/2 space-y-4 scale-90 flex justify-center items-center gap-[15rem]" >
              <div className=" flex flex-col gap-20">
                <div className="flex justify-between items-center gap-10">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-xl bg-purple-500"></div>
                    <p className="font-semibold">AAA</p>
                  </div>
                  <p>65%</p>
                </div>
                <div className="flex justify-between items-center gap-10">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-xl bg-green-400"></div>
                    <p className="font-semibold">BB</p>
                  </div>
                  <p>28%</p>
                </div>
              </div>

              <div className=" flex flex-col gap-20">
                <div className="flex justify-between items-center gap-10">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-400"></div>
                    <p className="font-semibold">C</p>
                  </div>
                  <p>15%</p>
                </div>
                <div className="flex justify-between items-center gap-10">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-xl bg-gray-400"></div>
                    <p className="font-semibold">A</p>
                  </div>
                  <p>2%</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
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
                transform: `translateX(${(currentAsset === undefined ? 0 : currentAsset) *
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
                transform: `translateY(${(currentAsset === undefined ? 0 : currentAsset) *
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
