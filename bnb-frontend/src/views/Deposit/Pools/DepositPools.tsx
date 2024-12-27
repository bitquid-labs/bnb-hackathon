import React, { useEffect, useMemo, useState } from "react";
import IconDownIcon from "assets/icons/IconDown";
import SectionTitle from "components/common/SectionTitle";
import { useAllPools } from "hooks/contracts/useAllPools";
import { getRiskTypeName } from "lib/number";
import { ADT, DepositType, IPool } from "types/common";
import { useAccount, useWriteContract } from "wagmi";
import { parseUnits } from "viem";
import { InsurancePoolContract, VaultContract } from "constants/contracts";
import useWallet from "hooks/useWallet";
import { ChainType } from "lib/wagmi";
import PoolList from "./PoolList";
import PoolDetail from "./PoolDetail";
import { scrollToTop } from "lib/utils";
// import { usePoolByAddress } from "hooks/contracts/usePoolByAddress";

type IPoolWithDetails = IPool & {
  displayDetails: boolean;
};

const DepositPools: React.FC = () => {
  const { address, chain } = useAccount();
  const pools = useAllPools();
  const [poolsData, setPoolsData] = useState<IPoolWithDetails[]>([]);
  const { writeContractAsync } = useWriteContract();
  // const userPools = usePoolByAddress(address as string);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // const depositedPoolIds = useMemo(() => {
  //   return userPools.map((pool) => Number(pool.poolId));
  // }, [userPools])

  const [currentPoolId, setCurrentPoolId] = useState<number | undefined>(
    undefined
  );

  console.log("all pools:", pools);

  useEffect(() => {
    if (!pools) return;
    setPoolsData(
      pools.map((pool: IPool) => ({
        ...pool,
        displayDetails: false,
      }))
    );
  }, [pools]);

  const handleDeposit = async (poolId: number) => {
    scrollToTop();
    setCurrentPoolId(poolId);
  };

  return (
    <>
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
    </>
    // <div className="w-full">
    //   <div className="mt-80 mb-57">
    //     <SectionTitle title="Explore BQ Labs Pools" />
    //   </div>
    //   <div className="w-full">
    //     <table className="w-full text-white">
    //       <thead className="">
    //         <tr className="[&>th]:text-20 [&th]:font-500 h-45">
    //           <th className=""></th>
    //           <th className="">Rating</th>
    //           <th className="">APY</th>
    //           <th className="">Min Tenure</th>
    //           <th className=""></th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {poolsData.map((pool, index) => (
    //           <>
    //             <tr className="px-8 text-center">
    //               <td className="font-[400] bg-[#1F1F1F] py-24 rounded-l-8">
    //                 {pool.poolName}
    //               </td>
    //               <td className="font-[500] bg-[#1F1F1F] py-24">{"AAA"}</td>
    //               <td className="font-[500] bg-[#1F1F1F] py-24">{pool.apy}</td>
    //               <td className="font-[400] bg-[#1F1F1F] py-24 rounded-r-8">
    //                 {pool.minPeriod}
    //               </td>
    //               <td className="bg-transparent">
    //                 <button
    //                   onClick={() => handleDeposit(Number(pool.id))}
    //                   className="bg-[#00ECBC66] border border-[#00ECBC] px-45 py-7 rounded-8"
    //                 >
    //                   Invest
    //                 </button>
    //               </td>
    //             </tr>

    //             <tr className="text-center">
    //               <td className="font-[400] w-[80%] p-20 pt-0" colSpan={4}>
    //                 <div className="bg-[#3D3D3D] rounded-b-4">
    //                   {!pool.displayDetails ? (
    //                     <></>
    //                   ) : (
    //                     <div className="flex w-full px-45 py-25">
    //                       <div className="flex w-[50%] flex-col items-center justify-center px-54">
    //                         <div className="flex items-center justify-between w-full">
    //                           <span className="text-22 font-[600]">
    //                             Network
    //                           </span>
    //                           <span>{"Bitcoin"}</span>
    //                           {/* <span>{pool.details.network}</span> */}
    //                         </div>
    //                         <div className="flex items-center justify-between w-full">
    //                           <span className="text-14 font-[400]">
    //                             Risk Covered
    //                           </span>
    //                           <span className="text-[#00ECBC] text-14 font-[600]">
    //                             {getRiskTypeName(pool.riskType)}
    //                           </span>
    //                         </div>
    //                       </div>
    //                       <div className="flex w-[50%] flex-col items-center justify-center px-54">
    //                         <div className="flex items-center justify-between w-full">
    //                           <span className="text-14 font-[400]">TVL</span>
    //                           <span className="text-14 font-[800]">
    //                             {pool.tvl}
    //                           </span>
    //                         </div>
    //                         <div className="flex items-center justify-between w-full">
    //                           <span className="text-14 font-[400]">
    //                             Investment Arm %
    //                           </span>
    //                           <span className="text-14 font-[800]">
    //                             {Number(pool.investmentArmPercent)} %
    //                           </span>
    //                         </div>
    //                         <div className="flex items-center justify-between w-full">
    //                           <span className="text-14 font-[400]">
    //                             Cover Purchase %
    //                           </span>
    //                           <span className="text-14 font-[800]">
    //                             {100 - Number(pool.investmentArmPercent)} %
    //                           </span>
    //                         </div>
    //                       </div>
    //                     </div>
    //                   )}
    //                   <div
    //                     className="flex items-center justify-center w-full gap-5 py-8 cursor-pointer"
    //                     onClick={() => {
    //                       setPoolsData((prev) =>
    //                         prev.map((pool, i) =>
    //                           i === index
    //                             ? {
    //                                 ...pool,
    //                                 displayDetails: !pool.displayDetails,
    //                               }
    //                             : pool
    //                         )
    //                       );
    //                     }}
    //                   >
    //                     <span>More Details</span> <IconDownIcon />
    //                   </div>
    //                 </div>
    //               </td>
    //             </tr>
    //           </>
    //         ))}
    //       </tbody>
    //     </table>
    //   </div>
    // </div>
  );
};

export default DepositPools;
