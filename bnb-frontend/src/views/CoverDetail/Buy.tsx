import React, { ChangeEvent } from "react";
import { CoverDueTo, RiskType } from "types/common";
import IconArrow from "assets/icons/IconArrow";
import { Slider } from "components/Slider";
import { BQBTC, MAX_COVER_PERIOD, MIN_COVER_PERIOD } from "constants/config";
import { cn } from "lib/utils";
import { TiInfoLarge } from "react-icons/ti";

type BuyProps = {
  id: number;
  coverAmount: string;
  handleCoverAmountChange: (event: ChangeEvent<HTMLInputElement>) => void;
  coverPeriod: number;
  handleCoverPeriodChange: (val: number) => void;
  dueTo: CoverDueTo;
  maxCoverAmount: number;
  riskType: RiskType | undefined;
  assetName: string;
};

const Buy: React.FC<BuyProps> = (props) => {
  const {
    id,
    coverAmount,
    coverPeriod,
    dueTo,
    maxCoverAmount,
    riskType,
    handleCoverAmountChange,
    handleCoverPeriodChange,
    assetName
  } = props;

  return (
    <div className="w-full bg-[#FFFFFF0D] border border-[#FFFFFF33] rounded-10 px-34 py-60">
      <div className="flex flex-col gap-8 rounded-[15px]">
        <div className="font-[600] text-15">Cover amount</div>
        <div className="flex h-auto rounded border border-[#2F3A42] p-5">
          <input
            className={cn(
              "placeholder:text-light/50 min-w-0 flex-auto border-none bg-transparent p-0 px-12 focus:border-none focus:outline-none focus:outline-offset-0 focus:ring-0"
            )}
            placeholder="Enter Amount"
            value={coverAmount || ""}
            onChange={(e) => handleCoverAmountChange(e)}
          />
          <div className="h-[36px] min-w-[86px] rounded-[10px] bg-[#131313] px-[13px] py-[6px] text-center text-[15px] leading-[24px] text-white">
            {assetName}
          </div>
        </div>
      </div>

      {/* <div className="flex w-full justify-end">
        <div className="flex w-fit items-center gap-2 rounded border border-white/5 bg-white/10 px-[11px] py-[9px]">
          <div className="text-xs font-semibold leading-[12px]">
            Max: {maxCoverAmount.toFixed(2)} {BQBTC.symbol}
          </div>
          <div className="flex h-[14px] w-[14px] items-center justify-center rounded border border-[#5B5B5B] bg-gradient-to-r from-[#3D3D3D] to-[#303030] text-[8px]">
            i
          </div>
        </div>
      </div> */}

      <div className="mt-60 flex flex-col gap-[8px]">
        <div className="font-[600] text-15">Tenure Period</div>
        <div className="flex items-end justify-between">
          <div className="flex h-auto w-152 rounded-8 border border-[#6D6D6D] p-4">
            <input
              className={cn(
                "ml-12 placeholder:text-light/50 min-w-0 flex-auto border-none bg-transparent p-0 px-3 focus:border-none focus:outline-none focus:outline-offset-0 focus:ring-0"
              )}
              readOnly
              value={coverPeriod || ""}
              onChange={(e) =>
                handleCoverPeriodChange(
                  Math.max(
                    MIN_COVER_PERIOD,
                    Math.min(MAX_COVER_PERIOD, Number(e.target.value))
                  )
                )
              }
            />
            <div className="h-[36px] min-w-[86px] rounded-[10px] bg-[#131313] px-[13px] py-[6px] text-center text-[15px] leading-[24px] text-white">
              days
            </div>
          </div>
          <div className="flex w-[200px] flex-col gap-3">
            <Slider
              rangeClassName="bg-[#00ECBC] h-[4px]"
              trackClassName="h-[4px]"
              thumbClassName="h-[14px] w-[14px]"
              defaultValue={[MIN_COVER_PERIOD]}
              value={[coverPeriod]}
              onValueChange={(val) => {
                handleCoverPeriodChange(val[0]);
              }}
              min={MIN_COVER_PERIOD}
              max={MAX_COVER_PERIOD}
              step={1}
            />
            <div className="flex justify-between px-3">
              <div>28 Days</div>
              <IconArrow className="w-6" />
              <div>365 Days</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buy;
