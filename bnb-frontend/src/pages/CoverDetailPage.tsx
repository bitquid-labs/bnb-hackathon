import { BQBTC, MIN_COVER_PERIOD } from "constants/config";
import { bnToNumber, numberToBN } from "lib/number";
import React, { ChangeEvent, useMemo, useState } from "react";
import { TiInfoLarge } from "react-icons/ti";
import { useParams, useNavigate } from "react-router";
import { ADT, CoverDueTo, ICover, RiskType } from "types/common";
import Buy from "views/CoverDetail/Buy";
import Preview from "views/CoverDetail/Preview";
import { calculateCoverFee } from "lib/utils";
import { useAllAvailableCovers } from "hooks/contracts/useAllAvailableCovers";
import { Address, erc20Abi, parseUnits } from "viem";
import { useAccount, useWriteContract } from "wagmi";
import { ICoverContract } from "constants/contracts";
import { Cover } from "views/Covers/Cover";
import IconArrowLeft from "assets/icons/IconArrowLeft";
import MoreCovers from "views/CoverDetail/MoreCovers";
import SocialLinks from "components/SocialLInks";
import { ChainType } from "lib/wagmi";
import { useERC20TokenApprovedTokenAmount } from "hooks/contracts/useTokenApprovedAmount";
import { toast } from "react-toastify";
import { feeDecimals } from "constants/config";
import { useTokenName } from "hooks/contracts/useTokenName";
import useCallContract from "hooks/contracts/useCallContract";
import premiumById from '../assets/premiumById.json';

const CoverDetailPage: React.FC = () => {
  const { id } = useParams();
  const { chain } = useAccount();
  const [coverAmount, setCoverAmount] = useState<string>("");
  const [coverPeriod, setCoverPeriod] = useState<number>(MIN_COVER_PERIOD);
  const [coverDueTo, setCoverDueTo] = useState<CoverDueTo>(
    CoverDueTo.NoneSelected
  );
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const availableCovers = useAllAvailableCovers();
  const { writeContract } = useWriteContract();
  const maxCoverAmount = 0;
  const navigate = useNavigate();
  const { writeContractAsync } = useWriteContract();
  const { callContractFunction } = useCallContract();

  const coverDetail = useMemo(() => {
    if (availableCovers.length === 0) return undefined;

    return availableCovers.find((cover) => {
      return Number(cover.id) === Number(id);
    });
  }, [availableCovers, id]);

  const coverADT = useMemo(() => {
    if (!coverDetail) return undefined;
    return coverDetail.adt;
  }, [coverDetail]);

  const coverAssetAddress = useMemo(() => {
    if (coverDetail) return coverDetail.asset;
  }, [coverDetail]);

  const assetTokenName = useTokenName(coverAssetAddress);

  const assetName = useMemo(() => {
    if (coverADT === ADT.Native) return "BNB";
    else return assetTokenName || "";
  }, [coverADT, assetTokenName]);

  const approvedTokenAmount = useERC20TokenApprovedTokenAmount(
    coverAssetAddress,
    ICoverContract.addresses[(chain as ChainType)?.chainNickName || "bscTest"],
    18
  );

  const approveTokenTransfer = async (amount: number) => {
    try {
      await callContractFunction(
        erc20Abi,
        coverAssetAddress as Address,
        "approve",
        [
          ICoverContract.addresses[
            (chain as ChainType)?.chainNickName
          ] as `0x${string}`,
          numberToBN(amount),
        ],
        0n,
        () => {
          toast.success("Token Approved");
          setIsLoading(false);
          setLoadingMessage("");
        },
        () => {
          setIsLoading(false);
          toast.success("Failed to approved token");
          setLoadingMessage("");
        }
      );

      // await writeContractAsync({
      //   abi: erc20Abi,
      //   address: coverAssetAddress as Address,
      //   functionName: "approve",
      //   args: [ICoverContract.addresses[(chain as ChainType)?.chainNickName] as `0x${string}`, numberToBN(amount)],
      // })
    } catch (error) {
      console.log("error:", error);
    }
  };

  const purchaseCover = async (
    coverId: number,
    amount: string,
    period: number,
    value: string,
    fee: number
  ) => {
    if (!coverDetail) return;
    const params = [
      coverId, // coverId
      numberToBN(amount), // coverAmount
      period, // coverPeriod
      parseUnits(fee.toString(), feeDecimals), //  coverFee
    ];

    console.log("params:", params);

    try {
      await callContractFunction(
        ICoverContract.abi,
        ICoverContract.addresses[
          (chain as ChainType)?.chainNickName || "bscTest"
        ],
        "purchaseCover",
        params,
        parseUnits(value, 18),
        () => {
          setIsLoading(false);
          setLoadingMessage("");
          toast.success("Cover Purchased");
        },
        () => {
          setIsLoading(false);
          setLoadingMessage("");
          toast.success("Failed to purchase cover");
        }
      );

      // await writeContractAsync({
      //   abi: ICoverContract.abi,
      //   address:
      //   ICoverContract.addresses[
      //       (chain as ChainType)?.chainNickName || "bscTest"
      //     ],
      //   functionName: "purchaseCover",
      //   args: params,
      //   value: parseUnits(value, feeDecimals),
      // });
    } catch (error) {
      console.log("error:", error);
    }
  };

  const coverFee = useMemo(() => {
    return calculateCoverFee(
      parseFloat(coverAmount),

      Number(premiumById[id as keyof typeof premiumById]),
      // Number(coverDetail?.cost), //pass premium value, 
      coverPeriod
    );
  }, [coverAmount, coverDetail?.cost, coverPeriod]);

  const handleCoverAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCoverAmount(e.target.value);
  };

  const handleCoverPeriodChange = (val: number) => {
    setCoverPeriod(val);
  };

  const error = useMemo(() => {
    if (coverAmount === "") return "Please enter an amount";
    if (coverDetail) {
      if (bnToNumber(coverDetail.maxAmount) < parseFloat(coverAmount)) {
        return "Over Max Amount";
      }
    }
    return "";
  }, [coverAmount]);

  const handleBuyCover = async () => {
    if (!coverDetail) return;

    setIsLoading(true);
    if (coverADT === ADT.Native) {

      console.log(Number(id), coverAmount, coverPeriod, "0", coverFee)

      setLoadingMessage("Submitting");
      await purchaseCover(
        Number(id),
        coverAmount,
        coverPeriod,
        coverFee.toString(),
        coverFee
      );
      // const params = [
      //   Number(id), // coverId
      //   numberToBN(coverAmount), // coverAmount
      //   coverPeriod, // coverPeriod
      //   parseUnits(coverFee.toString(), 18),  //  coverFee
      // ];

      // try {
      //   writeContract({
      //     abi: ICoverContract.abi,
      //     address: ICoverContract.addresses[(chain as ChainType)?.chainNickName || 'bscTest'],
      //     functionName: "purchaseCover",
      //     args: params,
      //     value: parseUnits(coverFee.toString(), 18),
      //   });
      // } catch (err) {
      //   console.log(err);
      // }
    } else {
      if (approvedTokenAmount < coverFee / 10000) {
        setLoadingMessage("Approve Tokens");
        await approveTokenTransfer(parseFloat(coverAmount));
        setIsLoading(false);
        return;
      }

      setLoadingMessage("Buying");
      

      await purchaseCover(Number(id), coverAmount, coverPeriod, "0", coverFee);
    }
  };

  return (
    <div className="w-full mx-auto max-w-1220 pt-70">
      <div className="flex justify-start w-full">
        <div
          className="flex items-center p-14 border border-[#6B7280] bg-[#6B72801A] rounded-10 cursor-pointer"
          onClick={() => navigate("/covers")}
        >
          <IconArrowLeft />
          <span className="ml-12">Buy Covers</span>
        </div>
      </div>
      <div className="mt-20 w-full bg-[#6B72801A] border border-[#6B7280] rounded-20 overflow-hidden px-42 py-22">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-[#FFF] rounded-full w-47 h-47 overflow-hidden">
              <img className="w-full" src={coverDetail?.CID} alt="cover-logo" />
            </div>
            <div className="ml-10 color-[#F1F1F1] text-20">
              {coverDetail?.coverName}
            </div>
          </div>
          <div
            className="my-[4px] flex items-center justify-center gap-[8px] rounded border border-[#363636] bg-[#292929] p-3 text-[14px]"
            data-tooltip-id="tooltip-terms"
          >
            <div className="pl-8">Terms & Conditions</div>
            <div className="rounded border border-[#363636] bg-[#3a3a3a] p-[5px]">
              <TiInfoLarge />
            </div>
          </div>
        </div>
        <div className="w-full my-20">
          <div className="flex justify-between w-full">
            <div className="w-[40%]">
              <Buy
                id={Number(id)}
                coverAmount={coverAmount}
                assetName={assetName}
                coverPeriod={coverPeriod}
                handleCoverAmountChange={handleCoverAmountChange}
                handleCoverPeriodChange={handleCoverPeriodChange}
                dueTo={coverDueTo}
                maxCoverAmount={maxCoverAmount}
                riskType={RiskType.Slashing}
                // riskType={selectedCover?.riskType}
              />
            </div>
            <div className="w-[55%]">
              <Preview
                productName={coverDetail?.coverName || ""}
                coverAmount={coverAmount}
                maxAmount={bnToNumber(coverDetail?.maxAmount)}
                assetName={assetName}
                annualCost={Number(coverDetail?.cost)}
                coverFee={coverFee}
                handleBuyCover={handleBuyCover}
                error={error}
                coverPeriod={coverPeriod}
                logo={coverDetail?.CID || ""}
                isLoading={isLoading}
                loadingMessage={loadingMessage}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mt-60">
        <div className="relative flex items-center justify-center w-full mb-20">
          <h2 className="z-10 text-center font-[600] text-30 text-[#FFF] bg-[#000000] px-20">
            Explore More Covers
          </h2>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
        </div>
        <div className="w-full">
          <MoreCovers
            currentCoverId={Number(id)}
            riskType={coverDetail?.riskType}
          />
        </div>
      </div>
      <SocialLinks />
    </div>
  );
};

export default CoverDetailPage;
