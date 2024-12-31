import IconBitcoin from "assets/icons/IconBitcoin";
import {
  BQBTCTokenContract,
  InsurancePoolContract,
  VaultContract,
} from "constants/contracts";
import useCallContract from "hooks/contracts/useCallContract";
import { useERC20TokenApprovedTokenAmount } from "hooks/contracts/useTokenApprovedAmount";
import { useVault } from "hooks/contracts/useVault";
import { bnToNumber, numberToBN } from "lib/number";
import { ChainType } from "lib/wagmi";
import React, { useMemo, useState } from "react";
import { useParams } from "react-router";
import { ADT } from "types/common";
import { Address, erc20Abi, formatEther, formatUnits, parseUnits } from "viem";
import { useAccount, useWriteContract, useBalance } from "wagmi";
import { toast } from "react-toastify";
import { useTokenName } from "hooks/contracts/useTokenName";
import { useVaultDeposit } from "hooks/contracts/useVaultDeposit";
import { useVaultTVL } from "hooks/contracts/useVaultTVL";
import Button from "components/common/Button";
import { getPoolRiskTypeName } from "lib/utils";
import bqBTCImg from "assets/images/bqbtc.svg";
import bnb from "assets/icons/bnb-logo.png";

type Props = {
  id: number;
  // isDeposited: boolean;
};

const VaultDetail: React.FC<Props> = ({ id }) => {
  const [stakeAmount, setStakeAmount] = useState("");
  const { address, chain } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { callContractFunction } = useCallContract();

  const vaultData = useVault(id);
  const tvl = useVaultTVL(id);

  console.log("vault detail:", vaultData);
  const userDeposit = useVaultDeposit(id);

  const assetType = useMemo(() => {
    if (vaultData) {
      return vaultData?.assetType;
    }
  }, [vaultData]);

  const assetAddress = useMemo(() => {
    if (vaultData) return vaultData?.asset;
  }, [vaultData]);

  const assetTokenName = useTokenName(assetAddress);

  const assetName = useMemo(() => {
    if (assetType === ADT.Native) return "BNB";
    else return assetTokenName || "";
  }, [assetType, assetTokenName]);

  const { data: balanceData } = useBalance({
    address: address,
    token: assetType === ADT.ERC20 ? assetAddress : undefined,
    unit: "ether",
  });

  const balance = useMemo(() => {
    if (!balanceData) return 0;
    return parseFloat(balanceData.formatted);
  }, [balanceData]);

  console.log("balance:", balance);

  const depositIntoVault = async (amount: string, value: string) => {
    const params = [
      Number(id), // vaultId
      parseUnits(amount, 18), // amount
    ];

    console.log("params:", params);

    try {
      await callContractFunction(
        VaultContract.abi,
        VaultContract.addresses[
          (chain as ChainType)?.chainNickName || "bscTest"
        ],
        "vaultDeposit",
        params,
        parseUnits(value, 18),
        () => {
          toast.success("Deposit succeeded");
          setLoadingMessage("");
          setIsLoading(false);
        },
        () => {
          setIsLoading(false);
          setLoadingMessage("");
          toast.success("Failed to deposit");
        }
      );

      // await writeContractAsync({
      //   abi: VaultContract.abi,
      //   address:
      //   VaultContract.addresses[
      //     (chain as ChainType)?.chainNickName || "bscTest"
      //   ],
      //   functionName: 'vaultDeposit',
      //   args: params,
      //   value: parseUnits(value, 18),
      // })
    } catch (error) {
      console.log("error:", error);
    }
  };

  const approveTokenTransfer = async (amount: number) => {
    try {
      await callContractFunction(
        erc20Abi,
        assetAddress as Address,
        "approve",
        [
          InsurancePoolContract.addresses[
            (chain as ChainType)?.chainNickName
          ] as `0x${string}`,
          numberToBN(amount),
        ],
        0n,
        () => {
          toast.success("Approved Tokens");
          setLoadingMessage("");
          setIsLoading(false);
        },
        () => {
          setIsLoading(false);
          setLoadingMessage("");
          toast.success("Failed to approve");
        }
      );

      // await writeContractAsync({
      //   abi: erc20Abi,
      //   address: assetAddress as Address,
      //   functionName: "approve",
      //   args: [InsurancePoolContract.addresses[(chain as ChainType)?.chainNickName] as `0x${string}`, numberToBN(amount)],
      // })
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const approvedTokenAmount = useERC20TokenApprovedTokenAmount(
    assetAddress,
    InsurancePoolContract.addresses[
      (chain as ChainType)?.chainNickName || "bscTest"
    ],
    18
  );

  const handleStake = async () => {
    if (!vaultData || !stakeAmount) return;

    // if (isDeposited) {
    //   toast.info("You have already deposited into this vault");
    //   return;
    // }

    if (balance < parseFloat(stakeAmount)) {
      toast.error("Insufficient balance");
      return;
    }

    // if (
    //   parseFloat(stakeAmount) >=
    //     parseFloat(formatEther(vaultData.maxInv || 0n)) ||
    //   parseFloat(stakeAmount) <= parseFloat(formatEther(vaultData.minInv || 0n))
    // ) {
    //   toast.error("Amount out of range");
    //   return;
    // }

    setIsLoading(true);

    if (assetType === ADT.Native) {
      setLoadingMessage("Submitting");
      await depositIntoVault("0", stakeAmount);
    } else {
      if (approvedTokenAmount < parseFloat(stakeAmount)) {
        setLoadingMessage("Approving Tokens");
        await approveTokenTransfer(parseFloat(stakeAmount));
        return;
      }

      setLoadingMessage("Submitting");
      await depositIntoVault(stakeAmount, "0");
    }
    // const params = [
    //   Number(id), // vaultId
    //   parseUnits(stakeAmount, 18), // amount
    //   Number(stakePeriod), // period
    // ];

    // try {
    //   await writeContractAsync({
    //     abi: VaultContract.abi,
    //     address:
    //       VaultContract.addresses[
    //         (chain as ChainType)?.chainNickName || "bscTest"
    //       ],
    //     functionName: "vaultDeposit",
    //     args: params,
    //     value: parseUnits(stakeAmount, 18),
    //   });
    // } catch (e) {
    //   console.log("error:", e);
    // }
  };

  const handleMintBQBTC = async () => {
    const params = [`${address}`, parseUnits("100", 18)];
    try {
      await writeContractAsync({
        abi: BQBTCTokenContract.abi,
        address:
          BQBTCTokenContract.addresses[(chain as ChainType)?.chainNickName],
        functionName: "mint",
        args: params,
      });
      console.log("succeed minting");
    } catch (err) {
      let errorMsg = "";
      if (err instanceof Error) {
        if (err.message.includes("User denied transaction signature")) {
          errorMsg = "User denied transaction signature";
        }
      }
      console.log("error minting");
    }
  };

  // const handleChangeStakeAmount = (value: string) => {

  // }
  return (
    <div className="w-full mx-auto max-w-1220">
      {/* <button onClick={handleMintBQBTC}>Mint BQBTC</button> */}
      <div
        className="w-full rounded-40 overflow-hidden bg-gradient bg-gradient-to-b from-[#00ECBC33] to-[#83ACF000]"
        style={
          {
            // background: `
            //     linear-gradient(0deg, rgba(0, 0, 0, 0.67), rgba(0, 0, 0, 0.67)),
            //     radial-gradient(100% 100% at 50% 0%, rgba(0, 236, 188, 0.2) 0.27%, rgba(131, 172, 240, 0) 100%)
            //   `,
          }
        }
      >
        <div className="flex items-center justify-between px-95 py-52">
          <div className="flex flex-col items-start justify-center">
            <div className="text-16 font-[700] text-[#00ECBC]">
              {vaultData?.vaultName}
            </div>
            <div className="relative z-[10]">
              <span className="font-[700] text-48">
                {Number(vaultData?.apy || 0n)} %
              </span>
              <span className="ml-8 text-19">APY</span>
            </div>
          </div>
          <div className="flex items-end gap-22">
            <div className="flex flex-col">
              <span className="text-15 font-[600]">Enter Amount:</span>
              <div className="flex items-center gap-4 bg-[#07040D] py-8 px-12 rounded-8 overflow-hidden h-45">
                <div className="flex items-center justify-center overflow-hidden rounded-full w-27 h-27">
                  <img
                    className="w-full"
                    src={assetType === ADT.Native ? bnb : bqBTCImg}
                    alt=""
                  />
                </div>
                <input
                  className="max-w-200 outline-none bg-transparent text-20 font-[700]"
                  value={stakeAmount}
                  onChange={(e) => {
                    setStakeAmount(e.target.value);
                  }}
                />
              </div>
            </div>
            <Button
              isLoading={isLoading}
              onClick={() => handleStake()}
              className="h-45 flex items-center justify-center  px-35 rounded-9 border border-[#6B728099] bg-gradient-to-r from-[rgba(0,236,188,0.8)] to-[rgba(32,81,102,0.096)] cursor-pointer"
            >
              {isLoading ? loadingMessage : "Stake Now"}
            </Button>
          </div>
        </div>
        <div className="px-95 py-34 bg-[#1A1D22]">
          <div className="flex items-center justify-between">
            {/* <div className="flex flex-col items-start gap-7">
              <div className="text-[#9DA3BA] text-13 font-[500]">
                Min Investment
              </div>
              <div className="flex items-end">
                <span className="text-[#00ECBC] text-24 font-[700] leading-[25px]">
                  {formatEther(vaultData?.minInv || 0n)}
                </span>
                <span className="text-[#FFF] text-12 ml-4">{assetName}</span>
              </div>
            </div> */}
            <div className="flex flex-col items-start gap-7">
              <div className="text-[#9DA3BA] text-13 font-[500]">Risk Type</div>
              <div className="flex items-end">
                <span className="text-[#00ECBC] text-24 font-[700] leading-[25px]">
                  {getPoolRiskTypeName(vaultData?.risk)}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-start gap-7">
              <div className="text-[#9DA3BA] text-13 font-[500]">
                Tenure Period
              </div>
              <div className="flex items-end">
                <span className="text-[#00ECBC] text-24 font-[700] leading-[25px]">
                  {Number(vaultData?.minPeriod)}
                </span>
                <span className="text-[#FFF] text-12 ml-4">Days</span>
              </div>
            </div>
            <div className="flex flex-col items-start gap-7">
              <div className="text-[#9DA3BA] text-13 font-[500]">
                TVL of Strategy
              </div>
              <div className="flex items-end">
                <span className="text-[#00ECBC] text-24 font-[700] leading-[25px]">
                  {tvl}
                </span>
                <span className="text-[#FFF] text-12 ml-4"> {"USD"}</span>
              </div>
            </div>
            <div className="flex flex-col items-start gap-7">
              <div className="text-[#9DA3BA] text-13 font-[500]">
                Pools Invested:
              </div>
              <div className="flex items-end">
                <div className="flex flex-col justify-center items-center gap-4 text-[#00ECBC] text-17 font-[700] leading-[25px]">
                  {vaultData?.pools?.map((vault, index) => (
                    <span key={index}>{vault.poolName}</span>
                  ))}
                </div>
                <span className="text-[#FFF] text-12 ml-4">{""}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className=""></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultDetail;
