import React, { useMemo, useState } from "react";
import { cn } from "lib/utils";
import VaultList from "views/Deposit/Vaults/VaultList";
import { DepositType } from "types/common";
import DepositPools from "views/Deposit/Pools/DepositPools";
import VaultDetail from "views/Deposit/Vaults/VaultDetail";

const DepositPage: React.FC = () => {
  const types = [
    {
      index: DepositType.Vault,
      depositType: "Strategies",
    },
    {
      index: DepositType.Pool,
      depositType: "Pools",
    },
  ];
  const [currentDepositType, setCurrentDepositType] = useState<number>(0);

  const [currentVaultId, setCurrentVaultId] = useState<number | undefined>();

  return (
    <div className="w-full mx-auto pt-70">
      <div className="mx-auto w-320">
        <div className="flex w-full cursor-pointer items-center rounded border border-white/10 bg-white/5 p-[3px]">
          <div className="relative flex w-full cursor-pointer flex-col items-center rounded md:flex-row md:gap-0">
            {types.map((opt, index) => (
              <div
                key={index}
                className={cn(
                  "z-10 w-full py-12 text-center text-sm font-medium capitalize transition-all",
                  currentDepositType === opt.index
                    ? "text-white"
                    : "text-white/50 "
                )}
                onClick={() => setCurrentDepositType(opt.index)}
              >
                <div
                  className={cn(
                    "flex justify-center border-r",
                    currentDepositType === opt.index
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
                  (currentDepositType === undefined ? 0 : currentDepositType) *
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
                  (currentDepositType === undefined ? 0 : currentDepositType) *
                  100
                }%)`,
              }}
            />
          </div>
        </div>
      </div>
      {currentDepositType === DepositType.Vault ? (
        <>
          {currentVaultId ? (
            <div className="mt-57">
              <VaultDetail id={currentVaultId} />
            </div>
          ) : (
            <></>
          )}
          <div className="w-full flex relative items-center justify-center mt-75 mb-20">
            <h2 className="z-10 text-center font-[600] text-30 text-[#FFF] bg-[#000000] px-20">
              Explore BQ Labs Strategies
            </h2>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
          </div>
          <div className="">
            <VaultList
              currentVaultId={currentVaultId}
              setCurrentVaultId={setCurrentVaultId}
            />
          </div>
        </>
      ) : (
        <div className="w-full max-w-1220 mx-auto">
          <DepositPools />
        </div>
      )}
      {/* {id ? (
        <div className="mt-50">
          <StrategyDetail />
        </div>
      ) : (
        <></>
      )} */}
    </div>
  );
};

export default DepositPage;
