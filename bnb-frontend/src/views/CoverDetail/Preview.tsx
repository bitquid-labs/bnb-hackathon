import { useConnectModal } from "@rainbow-me/rainbowkit";
import Button from "components/common/Button";
import ConnectWalletButton from "components/ConnectWalletButton";
import { BQBTC } from "constants/config";
import { formatDate } from "lib/number";
import React from "react";
import { useAccount } from "wagmi";

type PreviewProps = {
  handleBuyCover: () => void;
  error: string;
  productName: string;
  coverAmount: string;
  maxAmount: number;
  assetName: string;
  annualCost: number;
  coverFee: number;
  coverPeriod: number;
  logo: string;
  isLoading: boolean;
  loadingMessage: string;
};

const validatorData: Record<string, { yearlyCost: string }> = {
  Satoshi: { yearlyCost: "10 %" },
  BIMA: { yearlyCost: "11 %" },
  Lorenzo: { yearlyCost: "5 %" },
  Bedrock: { yearlyCost: "16 %" },
  FDUSD: { yearlyCost: "8 %" },
  LstBTC: { yearlyCost: "5 %" },
  LBTC: { yearlyCost: "4 %" },
  BounceBit_BTC: { yearlyCost: "6 %" },
  USDe: { yearlyCost: "14 %" },
  TUSD: { yearlyCost: "20 %" },
  InfStones: { yearlyCost: "11 %" },
  DAIC: { yearlyCost: "18 %" },
  Stakecito: { yearlyCost: "5 %" },
  Pier2: { yearlyCost: "6 %" },
  "Babylon Validator": { yearlyCost: "8 %" },
  "Core Validator": { yearlyCost: "10 %" },
};

const Preview: React.FC<PreviewProps> = (props) => {
  const {
    handleBuyCover,
    error,
    productName,
    coverAmount,
    annualCost,
    coverFee,
    coverPeriod,
    logo,
    isLoading,
    loadingMessage,
    maxAmount,
    assetName,
  } = props;

  const { openConnectModal } = useConnectModal();
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate((startDate.getDate() + coverPeriod) | 0);
  const { address } = useAccount();


  const yearlyCost =
    productName && validatorData[productName]
      ? parseFloat(validatorData[productName].yearlyCost.replace(" %", ""))
      : 0;

  const coverFees = parseFloat(coverAmount) * (yearlyCost / 100) * (coverPeriod / 365);

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="relative flex flex-col gap-4 rounded-10 border border-[#FFFFFF33] bg-[#FFFFFF0D] px-25 py-50">
        <div className="flex flex-col gap-12">
          <div className="flex items-center justify-between">
            <div>Product</div>
            <div className="flex items-center gap-[10px]">
              <div className="h-[32px] w-[32px] bg-[#D9D9D9] rounded-full overflow-hidden">
                <img className="w-full" src={logo} alt="cover-logo" />
                {/* <img
                  className='h-full w-full rounded-full'
                  src={logo}
                  alt='logo'
                /> */}
              </div>
              {/* <div className='bg-background-200 h-5 w-5 rounded-full' /> */}
              <div>{productName}</div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-[10px]">
              <div>Cover amount</div>
              {/* <div className='bg-background-200 h-5 w-5 rounded-full' /> */}
            </div>
            <div className="flex gap-[10px]">
              <div className="font-semibold">
                {coverAmount} {assetName}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-[10px]">
              <div>Max amount</div>
              {/* <div className='bg-background-200 h-5 w-5 rounded-full' /> */}
            </div>
            <div className="flex gap-[10px]">
              <div className="font-semibold">
                {maxAmount} {assetName}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-[10px]">
              <div>Cover period</div>
              {/* <div className='bg-background-200 h-5 w-5 rounded-full' /> */}
            </div>
            <div className="font-semibold">
              {formatDate(startDate)} - {formatDate(endDate)}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-[10px]">
              <div>Yearly Cost</div>
              {/* <div className='bg-background-200 h-5 w-5 rounded-full' /> */}
            </div>
            {/* <div className="font-semibold">{annualCost}%</div> */}
            <div className="font-semibold">
              {yearlyCost}%
            </div>
          </div>
          <div className="bg-border-100 h-[0.5px] w-full"></div>
        </div>
        <div className="w-full h-1 bg-[#FFF] mb-12" />
        <div className="flex items-center justify-between">
          <div className="text-14 font-[600]">Cover fee</div>
          <div className="flex items-center gap-2">
            {/* {!!coverFee && (
              <div>
                {(coverFee / 10000).toFixed(coverFee ? Math.max(Math.round(Math.log10(1 / Math.abs(coverFee))), 5) : 5)}
              </div>
            )} */}
            {/* <Dropdown
              value={selectedToken}
              setValue={setSelectedToken}
              options={['WBTC', 'WETH', 'USDC']}
            /> */}

            <div>{isNaN(coverFees) || coverFees === 0 ? null : (
              <p className="text-lg font-semibold text-emerald-400">{coverFees}</p>
            )}
            </div>

            <div className="ml-10 rounded-6 bg-[#D9D9D933] px-[25px] py-[5px]">{BQBTC.symbol}</div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-20">
        {address && (
          <Button
            isLoading={isLoading}
            className="w-fit min-w-302 rounded-8 bg-gradient-to-r from-[#00ECBC66] to-[#00ECBC80] py-16 text-center border border-[#00ECBC]"
            onClick={handleBuyCover}
            disabled={!!error}
          >
            {error ? error : isLoading ? loadingMessage : "Buy Cover"}
          </Button>
        )}
        {!address && <ConnectWalletButton />}
      </div>
    </div>
  );
};

export default Preview;
