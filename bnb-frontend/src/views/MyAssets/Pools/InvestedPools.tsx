import SectionTitle from "components/common/SectionTitle";
import { usePoolByAddress } from "hooks/contracts/usePoolByAddress";
import React, { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import PoolCard from "./PoolCard";
import { ICoverContract } from "constants/contracts";
import { ChainType } from "lib/wagmi";
import UserStatus from "./UserStatus";
import InvestedOverview from "./Invest/InvestedOverview";
import StakedView from "./Invest/StakedView";
import { toast } from "react-toastify";
import useCallContract from "hooks/contracts/useCallContract";

const InvestedPools: React.FC = () => {
  const { address, chain } = useAccount();
  const userPools = usePoolByAddress(address as string);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { writeContractAsync } = useWriteContract();
  const { callContractFunction } = useCallContract();

  console.log('user pools:', userPools)

  // const handleClaimYeild = async (poolId: number) => {
  //   setIsLoading(true);
  //   const params = [poolId];

  //   try {
  //     await callContractFunction(
  //       ICoverContract.abi,
  //       ICoverContract.addresses[
  //         (chain as ChainType)?.chainNickName
  //       ] as `0x${string}`,
  //       "claimPayoutForLP",
  //       params,
  //       0n,
  //       () => {
  //         toast.success("Cover purchased!")
  //         setIsLoading(false);
  //       },
  //       () => {
  //         setIsLoading(false);
  //         toast.success("Failed purchase")
  //       }
  //     );

  //     await writeContractAsync({
  //       abi: ICoverContract.abi,
  //       address: ICoverContract.addresses[
  //         (chain as ChainType)?.chainNickName
  //       ] as `0x${string}`,
  //       functionName: "claimPayoutForLP",
  //       args: params,
  //     });
  //   } catch (error) {
  //     console.log("error:", error);
  //   }
  // };

  return (
    <div className="w-full">
      {/* <UserStatus />
      <div className="flex justify-between items-stretch">
        <div className="w-[48%]">
          <StakedView />
        </div>
        <div className="w-[48%] h-full">
          <InvestedOverview />
        </div>
      </div> */}
      <SectionTitle title="Invested Pools Overview" />
      <div className="mt-52">
        {userPools.map((pool, index) => (
          <PoolCard
            poolDetail={pool}
            key={index}
            // handleClaimYeild={() => handleClaimYeild(Number(pool.poolId))}
          />
        ))}
      </div>
    </div>
  );
};

export default InvestedPools;
