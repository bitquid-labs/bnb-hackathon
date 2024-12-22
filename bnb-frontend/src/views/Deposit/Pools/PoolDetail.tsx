import React, { useEffect, useMemo, useState } from "react";
import { Slider } from "components/Slider";
import poolDetailIcon from "assets/images/pool_detail.png";
import networkBOBIcon from "assets/images/network_bob.png";
import networkBSCIcon from "assets/images/network_bsc.png";
import IconArrow from "assets/icons/IconArrow";
import { usePoolInfo } from "hooks/contracts/usePoolInfo";
import { ADT, DepositType } from "types/common";
import { useAccount, useBalance, useWriteContract } from "wagmi";
import { Address, erc20Abi, parseUnits } from "viem";
import { InsurancePoolContract } from "constants/contracts";
import { ChainType } from "lib/wagmi";
import { useERC20TokenApprovedTokenAmount } from "hooks/contracts/useTokenApprovedAmount";
import { numberToBN } from "lib/number";
import { zeroAddress } from "viem";
import { toast } from "react-toastify";
import useCallContract from "hooks/contracts/useCallContract";
import { useTokenName } from "hooks/contracts/useTokenName";
import { usePoolDeposit } from "hooks/contracts/usePoolDeposit";

type Props = {
  poolId: number;
};

const PoolDetail: React.FC<Props> = ({ poolId }) => {
  const { address, chain } = useAccount();
  const poolData = usePoolInfo(poolId);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositPeriod, setDepositPeriod] = useState<number>(
    Number(poolData?.minPeriod) || 0
  );
  const { writeContractAsync } = useWriteContract();
  const [loadingMessage, setLoadingMessage] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { callContractFunction } = useCallContract();

  const depositADT = useMemo(() => {
    if (!poolData) return undefined;
    return poolData.assetType;
  }, [poolData]);

  const assetType = useMemo(() => {
    if (poolData) {
      return poolData?.assetType;
    }
  }, [poolData]);

  const assetAddress = useMemo(() => {
    if (poolData) {
      return poolData?.asset;
    }
  }, [poolData]);

  const assetTokenName = useTokenName(assetAddress);

  const {data: balanceData} = useBalance({
    address: address,
    token: depositADT === ADT.ERC20 ? assetAddress : undefined,
    unit: 'ether'
  });

  const assetName = useMemo(() => {
    if (depositADT === ADT.Native) return "BNB";
    else return assetTokenName || "";
  }, [depositADT, assetTokenName]);

  const handleDepositPeriodChange = (newVal: number) => {
    setDepositPeriod(newVal);
  };
  const approvedTokenAmount = useERC20TokenApprovedTokenAmount(assetAddress, InsurancePoolContract.addresses[
    (chain as ChainType)?.chainNickName || "bscTest"
  ], 18);

  const approveTokenTransfer = async (amount: number) => {
    try {
      await callContractFunction(
        erc20Abi,
        assetAddress as Address,
        "approve",
        [InsurancePoolContract.addresses[(chain as ChainType)?.chainNickName] as `0x${string}`, numberToBN(amount)],
        0n,
        () => {
          toast.success("Token Approved")
          setIsLoading(false);
          setLoadingMessage("")
        },
        () => {
          setIsLoading(false);
          setLoadingMessage("")
          toast.success("Failed to approve")
        }
      )
      // await writeContractAsync({
      //   abi: erc20Abi,
      //   address: assetAddress as Address,
      //   functionName: "approve",
      //   args: [InsurancePoolContract.addresses[(chain as ChainType)?.chainNickName] as `0x${string}`, numberToBN(amount)],
      // })  
    } catch (error) {
      console.log('error: ', error)
    }
  }

  console.log('pool detail:', poolData, approvedTokenAmount)
  const userPoolDeposit = usePoolDeposit(poolId);

  const depositIntoPool = async (assetType: ADT, __assetAddress: string, value: string) => {
    const params = [
      address,
      poolId,
      parseUnits(depositAmount, 18),
      DepositType.Normal,
      assetType,
      __assetAddress,
    ]

    console.log('params:', params)

    try {
      await callContractFunction(
        InsurancePoolContract.abi,
        InsurancePoolContract.addresses[
          (chain as ChainType)?.chainNickName || "bscTest"
        ],
        "deposit",
        [params],
        parseUnits(value, 18),
        () => {
          toast.success("Deposit Succeed")
          setIsLoading(false);
          setLoadingMessage("")
        },
        () => {
          setIsLoading(false);
          setLoadingMessage("")
          toast.success("Failed to deposit")
        }
      )

      // await writeContractAsync({
      //   abi: InsurancePoolContract.abi,
      //   address:
      //     InsurancePoolContract.addresses[
      //       (chain as ChainType)?.chainNickName || "bscTest"
      //     ],
      //   functionName: "deposit",
      //   args: [params],
      //   value: parseUnits(value, 18),
      // });
    } catch (e) {
      console.log("error:", e);
    }
  }

  const handleDeposit = async () => {
    if (!poolData || !assetAddress) return;

    setIsLoading(true);

    if (assetType === ADT.Native) {
      setLoadingMessage("Submitting ...")
      await depositIntoPool(ADT.Native, zeroAddress, depositAmount);
    } else {
      if (approvedTokenAmount < parseFloat(depositAmount)) {
        setLoadingMessage("Approve Tokens ...")
        await approveTokenTransfer(parseFloat(depositAmount))
        setLoadingMessage("")
        return;
      }
      setLoadingMessage("Submitting ...")
      await depositIntoPool(ADT.ERC20, assetAddress, "0");
    }

    // setIsLoading(false);
    // setLoadingMessage("")
  };

  useEffect(() => {
    if (poolData)
    setDepositPeriod(Number(poolData.minPeriod));
  }, [poolData]);

  return (
    <div className="w-full">
      <div className="flex items-center">
        <div className="w-47 h-47 bg-[#FFFFFF] rounded-full overflow-hidden">
          <img src={poolDetailIcon} className="w-full" alt="poo_detail" />
        </div>
        <h2 className="text-30 font-600 text-white pl-10">
          {poolData?.poolName}
        </h2>
      </div>
      <div className="px-42 py-32 border border-[#6B7280] bg-[#6B72801A] rounded-20 mt-20">
        <div className="flex justify-between items-center mt-20">
          <div className="flex w-full max-w-[300px] items-center rounded-10 border border-[#9E9E9E] p-6">
            <div className="relative flex w-full flex-col items-center rounded-lg md:flex-row md:gap-0">
              {["Stake", "Unstake"].map((opt, index) => (
                <div
                  key={index}
                  className="z-10 w-full py-8 text-center text-base capitalize text-white transition-all"
                  // onClick={() => setSelectedType(index)}
                >
                  {opt}
                </div>
              ))}
              <div
                className="absolute inset-y-0 hidden rounded-lg border border-[#00ECBC] bg-[#00ECBC]/10 transition-all md:block"
                style={{
                  width: `50%`,
                  transform: `translateX(100%)`,
                }}
              />
              <div
                className="absolute inset-x-0 rounded-lg border border-[#00ECBC] bg-[#00ECBC]/10 transition-all md:hidden"
                style={{
                  height: `50%`,
                  // transform: `translateY(${selectedType * 100}%)`,
                }}
              />
            </div>
          </div>
          <div className="flex items-center text-white">
            <div className="border border-[#6B7280] rounded-10 bg-[#FFFFFF0D] py-12 px-20">
              APY: {Number(poolData?.apy)}%
            </div>
            <div className="flex items-center justify-center border border-[#6B7280] rounded-10 bg-[#FFFFFF0D] py-12 px-20">
              <img
                src={networkBOBIcon}
                className="w-25 h-24"
                alt="network_bob"
              />
              <span className="pl-4">BOB Chain</span>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-between mt-10">
          <div className="w-[60%] p-24 bg-[#FFFFFF0D] border border-[#FFFFFF33] rounded-10">
            <div className="w-full">
              <div className="w-full flex items-center justify-between mt-50">
                <div className="">
                  <span className="text-15 text-white">Balance: </span>
                  <span className="text-15 text-white">{balanceData?.formatted}</span>
                </div>
                <div className="flex items-center gap-12">
                  <div className="px-10 rounded-5 border border-[#FFFFFF33] bg-[#FFFFFF0D] text-[#858585]">
                    25%
                  </div>
                  <div className="px-10 rounded-5 border border-[#FFFFFF33] bg-[#FFFFFF0D] text-[#858585]">
                    50%
                  </div>
                  <div className="px-10 rounded-5 border border-[#FFFFFF33] bg-[#FFFFFF0D] text-[#858585]">
                    MAX
                  </div>
                </div>
              </div>
              <div className="my-8 w-full flex items-center justify-between">
                {/* <div className="text-25 font-[500]">3.197</div> */}
                <div className="text-25 font-[500]">
                  <input
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="outline-none bg-transparent border-b-[#717A8C] border-b"
                    value={depositAmount}
                    placeholder="3.94"
                  />
                </div>
                <div className="flex justify-center items-center">
                  <span className="text-15 font-[500]">{assetName}</span>
                  {/* <div className="flex">
                    <img src={networkBSCIcon} alt="bsc" className="w-20 h-20" />
                  </div> */}
                </div>
              </div>
              <div className="w-full flex items-center justify-between">
                <span className="text-12 text-[#C0C0C0] font-[400]">
                  ≈$ 639.58
                </span>
                <span className="text-12 text-[#C0C0C0] font-[600]">
                  Transaction Fee
                </span>
              </div>
              <div className="w-full flex items-center justify-start my-10">
                <span className="text-14 font-[600]">LIT Token Assigned:</span>
                <span className="text-14 font-[600]">15.6</span>
              </div>
              <div className="w-full">
                <button
                  onClick={handleDeposit}
                  className="bg-[#00ECBC66] border border-[#00ECBC] px-45 py-7 rounded-8 w-full"
                >
                  {isLoading ? loadingMessage : 'Deposit'}
                </button>
              </div>
            </div>
          </div>
          <div className="w-[39%] p-24 bg-[#FFFFFF0D] border border-[#FFFFFF33] rounded-10">
            <div className="flex items-center justify-start gap-20">
              <div className="text-15 font-[600]">Risk Type:</div>
              <div className="border border-[#00ECBC] bg-[#00ECBC0D] rounded-8 px-24 py-4">
                Low
              </div>
            </div>
            <div className="flex w-full">
              <div className="flex flex-col gap-[13px] w-full">
                <div className="flex items-center mt-40 justify-between">
                  <div className="flex gap-[10px]">
                    <div className="text-15 font-[600]">Tenure Period</div>
                  </div>
                </div>
                <div className="w-full flex items-center justify-between">
                  <div className="flex h-auto w-120 rounded-8 border border-[#6D6D6D] px-1 py-2">
                    <input
                      className="pl-10 placeholder:text-light/50 min-w-0 flex-auto border-none bg-transparent p-0 px-3 focus:border-none focus:outline-none focus:outline-offset-0 focus:ring-0"
                      readOnly
                      value={depositPeriod}
                      onChange={(e) => {
                        handleDepositPeriodChange(
                          Math.max(
                            Number(poolData?.minPeriod) || 0,
                            Math.min(
                              Number(poolData?.minPeriod) || 0,
                              Number(e.target.value)
                            )
                          )
                        );
                      }}
                    />
                    <div className="h-[36px] rounded-[10px] bg-[#131313] px-[10px] py-4 text-center text-[10px] leading-[24px] text-white">
                      Days
                    </div>
                  </div>
                  <div className="flex w-[200px] flex-col gap-3">
                    <Slider
                      rangeClassName="bg-[#00ECBC] h-[4px]"
                      thumbClassName="h-[14px] w-[14px]"
                      trackClassName="h-[4px]"
                      defaultValue={[Number(poolData?.minPeriod) || 0]}
                      value={[depositPeriod]}
                      onValueChange={(val) => {
                        handleDepositPeriodChange(val[0]);
                      }}
                      min={Number(poolData?.minPeriod)}
                      max={250}
                      step={1}
                    />
                    <div className="flex justify-between px-3">
                      <div>{Number(poolData?.minPeriod) || 0} Days</div>
                      <IconArrow className="w-6" />
                      <div>365 Days</div>
                    </div>
                  </div>
                </div>
                <div className="">
                  <span className="text-15 font-[600]">Rewards (by $0)</span>
                </div>
                <div className="flex w-full items-start justify-between">
                  <div className="flex flex-col h-full items-center justify-between gap-5">
                    <div className="text-15 font-[600]">Selected Strategy</div>
                    <div className="bg-[#00ECBC1A] px-40 py-5 rounded-10">
                      Vesting
                    </div>
                  </div>
                  <div className="flex flex-col h-full items-center justify-between gap-5">
                    <span className="text-15 font-[600]">Per week</span>
                    <span className="text-15 font-[600] py-5">xx %</span>
                  </div>
                  <div className="flex flex-col h-full items-center justify-between gap-5">
                    <span className="text-15 font-[600]">Per month</span>
                    <span className="text-15 font-[600] py-5">xx %</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolDetail;
