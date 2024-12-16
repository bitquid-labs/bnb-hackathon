import { MIN_COVER_PERIOD } from "constants/config";
import { bnToNumber, numberToBN } from "lib/number";
import React, { ChangeEvent, useMemo, useState } from "react";
import { TiInfoLarge } from "react-icons/ti";
import { useParams, useNavigate } from "react-router";
import { ADT, CoverDueTo, ICover, RiskType } from "types/common";
import Buy from "views/CoverDetail/Buy";
import Preview from "views/CoverDetail/Preview";
import { calculateCoverFee } from "lib/utils";
import { useAllAvailableCovers } from "hooks/contracts/useAllAvailableCovers";
import { parseUnits } from "viem";
import { useAccount, useWriteContract } from "wagmi";
import { ICoverContract } from "constants/contracts";
import { Cover } from "views/Covers/Cover";
import IconArrowLeft from "assets/icons/IconArrowLeft";
import MoreCovers from "views/CoverDetail/MoreCovers";
import SocialLinks from "components/SocialLInks";
import { ChainType } from "lib/wagmi";

const CoverDetailPage: React.FC = () => {
  const { id } = useParams();
  const { chain } = useAccount();
  const [coverAmount, setCoverAmount] = useState<string>("");
  const [coverPeriod, setCoverPeriod] = useState<number>(MIN_COVER_PERIOD);
  const [coverDueTo, setCoverDueTo] = useState<CoverDueTo>(
    CoverDueTo.NoneSelected
  );
  const availableCovers = useAllAvailableCovers();
  const { writeContract } = useWriteContract();
  const maxCoverAmount = 0;
  const error = "";
  const navigate = useNavigate();

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

  const coverFee = useMemo(() => {
    return calculateCoverFee(
      parseFloat(coverAmount),
      Number(coverDetail?.cost || 0),
      coverPeriod
    );
  }, [coverAmount, coverDetail?.cost, coverPeriod]);

  const handleCoverAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCoverAmount(e.target.value);
  };

  const handleCoverPeriodChange = (val: number) => {
    setCoverPeriod(val);
  };

  const handleBuyCover = async () => {
    if (!coverDetail) return;
    if (coverADT === ADT.Native) {
      const params = [
        Number(id), // coverId
        numberToBN(coverAmount), // coverAmount
        coverPeriod, // coverPeriod
        parseUnits(coverFee.toString(), 18),  //  coverFee
      ];

      try {
        writeContract({
          abi: ICoverContract.abi,
          address: ICoverContract.addresses[(chain as ChainType)?.chainNickName || 'bscTest'],
          functionName: "purchaseCover",
          args: params,
          value: parseUnits(coverFee.toString(), 18),
        });
      } catch (err) {
        console.log(err);
      }
    } else {
    }
  };

  return (
    <div className="w-full max-w-1220 mx-auto pt-70">
      <div className="w-full flex justify-start">
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
          <div className="w-full flex justify-between">
            <div className="w-[40%]">
              <Buy
                id={Number(id)}
                coverAmount={coverAmount}
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
                annualCost={Number(coverDetail?.cost)}
                coverFee={coverFee}
                handleBuyCover={handleBuyCover}
                error={error}
                coverPeriod={coverPeriod}
                logo={coverDetail?.CID || ""}
                isLoading={false}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mt-60">
        <div className="w-full flex relative items-center justify-center mb-20">
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
