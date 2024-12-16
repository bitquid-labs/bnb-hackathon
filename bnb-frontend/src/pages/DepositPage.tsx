import React, { useMemo, useState } from "react";
import SwitchComponent from "components/Switch";
import { cn } from "lib/utils";
import Strategies from "views/Deposit/Strategies";
import StrategyCard from "views/Deposit/StrategyCard";
import { useParams } from "react-router";
import useWallet from "hooks/useWallet";
import { useAccount } from "wagmi";
import { useAllVaults } from "hooks/contracts/useAllVaults";
import StrategyDetail from "views/Deposit/StrategyDetail";

const DepositPage: React.FC = () => {
  const { id } = useParams();
  const types = [
    {
      index: 0,
      depositType: "Strategies",
    },
    {
      index: 1,
      depositType: "Pools",
    },
  ];
  const [currentType, setCurrentType] = useState<number>(0);

  const currentStrategy = useMemo(() => {
    if (!id) return undefined;
  }, [id]);

  return (
    <div className="w-full px-75 mx-auto pt-70">
      <div className="mx-auto w-320">
        <div className="flex w-full cursor-pointer items-center rounded border border-white/10 bg-white/5 p-[3px]">
          <div className="relative flex w-full cursor-pointer flex-col items-center rounded md:flex-row md:gap-0">
            {types.map((opt, index) => (
              <div
                key={index}
                className={cn(
                  "z-10 w-full py-12 text-center text-sm font-medium capitalize transition-all",
                  currentType === opt.index ? "text-white" : "text-white/50 "
                )}
                onClick={() => setCurrentType(opt.index)}
              >
                <div
                  className={cn(
                    "flex justify-center border-r",
                    currentType === opt.index
                      ? "border-white/10 "
                      : "border-transparent"
                  )}
                >
                  {opt.depositType}
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
                  (currentType === undefined ? 0 : currentType) * 100
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
                  (currentType === undefined ? 0 : currentType) * 100
                }%)`,
              }}
            />
          </div>
        </div>
      </div>
      {id ? (
        <div className="mt-50">
          <StrategyDetail />
        </div>
      ) : (
        <>
          <div className="w-full flex relative items-center justify-center mt-75 mb-20">
            <h2 className="z-10 text-center font-[600] text-30 text-[#FFF] bg-[#000000] px-20">
              Explore BQ Labs Strategies
            </h2>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
          </div>
          <div className="">
            <Strategies />
          </div>
        </>
      )}
    </div>
  );
};

export default DepositPage;
