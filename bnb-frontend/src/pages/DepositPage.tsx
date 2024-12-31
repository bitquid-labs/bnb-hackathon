import React, { useEffect, useMemo, useState } from "react";
import { cn, scrollToTop } from "lib/utils";
import VaultList from "views/Deposit/Vaults/VaultList";
import { DepositType, IPool } from "types/common";
import DepositPools from "views/Deposit/Pools/DepositPools";
import VaultDetail from "views/Deposit/Vaults/VaultDetail";
import { useVaultByAddress } from "hooks/contracts/useVaultByAddress";
import { useAccount } from "wagmi";
import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import SectionTitle from "components/common/SectionTitle";
import Button from "components/common/Button";
import PoolDetail from "views/Deposit/Pools/PoolDetail";
import PoolList from "views/Deposit/Pools/PoolList";
import { useAllPools } from "hooks/contracts/useAllPools";

type IPoolWithDetails = IPool & {
  displayDetails: boolean;
};

const DepositPage: React.FC = () => {
  const types = [
    {
      index: DepositType.Normal,
      depositType: "Pools",
    },
    {
      index: DepositType.Vault,
      depositType: "Strategies",
    },
  ];
  const [searchParams] = useSearchParams();
  const { address } = useAccount();
  const [currentDepositType, setCurrentDepositType] = useState<number>(0);
  const { vaults: userVaults } = useVaultByAddress(address as string);
  const pools = useAllPools();
  // const userVaultIds = useMemo(() => {
  //   return userVaults.map((vault) => Number(vault.vaultId));
  // }, [userVaults]);

  const [currentVaultId, setCurrentVaultId] = useState<number | undefined>();
  const [currentPoolId, setCurrentPoolId] = useState<number | undefined>();
  const showIntroText = useMemo(() => {
    return currentPoolId === undefined && currentVaultId === undefined;
  }, [currentPoolId, currentVaultId]);

  const [poolsData, setPoolsData] = useState<IPoolWithDetails[]>([]);

  const handleSwitchDepositType = (newVal: number) => {
    setCurrentPoolId(undefined);
    setCurrentVaultId(undefined);

    setCurrentDepositType(newVal);
  };

  const handleDeposit = async (poolId: number) => {
    scrollToTop();
    setCurrentPoolId(poolId);
  };

  useEffect(() => {
    if (searchParams.get("type") === undefined) return;
    setCurrentDepositType(Number(searchParams.get("type")));
  }, [searchParams]);

  useEffect(() => {
    if (!pools) return;
    setPoolsData(
      pools.map((pool: IPool) => ({
        ...pool,
        displayDetails: false,
      }))
    );
  }, [pools]);

  return (
    <div className="w-full mx-auto pt-70">
      {showIntroText ? (
        <>
          <div className="flex flex-col items-center justify-center w-full">
            <h2 className="text-50 font-[700]">
              Introducing <span className="text-[#00ECBC]">BQ Deposits</span>
            </h2>
            <div className="mt-24 max-w-700 text-18 font-[500] text-[#FFFFFFA3]">
              Grow and protect your assets through carefully curated pools and
              strategies tailored for the Web3 ecosystem. Introducing{" "}
              <span className="text-[#00ECBC]">BQ Deposits</span>—your gateway
              to innovative and secure investment solutions.
            </div>
            <div className="flex items-center justify-center gap-20 mt-45">
              {/* <ConnectWalletButton className="min-w-[216px] rounded-8 bg-gradient-to-r from-[#00ECBC66] to-[#00ECBC80] border border-[#00ECBC] w-full py-12" />
          <Button variant="outline" size="lg" className="rounded-8">
            Read BQ Labs Docs
          </Button> */}
              <Button
                variant="outline"
                size="lg"
                className="rounded-8"
                onClick={() => window.open("https://docs.bqlabs.xyz/", "_blank")}
              >
                Read BQ Labs Docs
              </Button>

            </div>
          </div>
          <div className="my-98 max-w-1220 mx-auto h-1 bg-gradient-to-r from-[#FFFFFF] to-[#161618]"></div>
        </>
      ) : (
        <></>
      )}
      <div className="mx-auto max-w-1220 flex justify-center items-center">
        <div className="w-320 flex cursor-pointer items-center rounded border border-white/10 bg-white/5 p-[3px]">
          <div className="relative flex flex-col items-center w-full rounded cursor-pointer md:flex-row md:gap-0">
            {types.map((opt, index) => (
              <div
                key={index}
                className={cn(
                  "z-10 w-full py-8 text-center text-sm font-medium capitalize transition-all",
                  currentDepositType === opt.index
                    ? "text-white"
                    : "text-white/50 "
                )}
                onClick={() => handleSwitchDepositType(opt.index)}
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
                transform: `translateX(${(currentDepositType === undefined ? 0 : currentDepositType) *
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
                transform: `translateY(${(currentDepositType === undefined ? 0 : currentDepositType) *
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
              <VaultDetail
                id={currentVaultId}
              // isDeposited={userVaultIds.includes(currentVaultId)}
              />
            </div>
          ) : (
            <></>
          )}
          <div className="relative flex items-center justify-center w-full mb-20 mt-75">
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
        <div className="w-full mx-auto max-w-1220">
          {currentPoolId !== undefined ? (
            <div className="mt-20">
              <PoolDetail
                poolId={currentPoolId}
              // isDeposited={depositedPoolIds.includes(currentPoolId!)}
              />
            </div>
          ) : (
            <></>
          )}
          <PoolList
            poolData={poolsData}
            handleDeposit={handleDeposit}
            sectionTitle="Explore BQ Labs Pools"
            setPoolsData={setPoolsData}
          />
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
