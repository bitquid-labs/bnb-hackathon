// import { useRouter } from 'next/navigation';
import React, { useCallback, useContext, useMemo } from 'react';

import Button from 'components/common/Button';

import { ADT, ICover } from 'types/common';
// import { CoverContext } from '@/contexts/CoverContext';
import { bnToNumber, getRiskTypeName } from 'lib/number';
import { useNavigate } from 'react-router';
import { useTokenName } from 'hooks/contracts/useTokenName';

export type CoverProps = {
  cover: ICover,
  disabled: boolean;
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

export const Cover: React.FC<CoverProps> = (props) => {
  const { coverName, chains, cost, capacity, id, riskType, maxAmount, CID, adt, asset } = props.cover;
  const riskTypeName = getRiskTypeName(riskType);
  const annualCost = useMemo(() => {
    return Number(cost);
  }, [cost]);
  const navigate = useNavigate();
  const assetTokenName = useTokenName(asset);

  const assetName = useMemo(() => {
    if (adt === ADT.Native) return "BNB";
    else return assetTokenName || "";
  }, [adt, assetTokenName]);

  // const { setSelectedCover } = useContext(CoverContext)!;
  // const router = useRouter();

  const handleCoverDetail = useCallback(
    (cover: ICover) => {
      navigate(`/coverdetail/${id}`);
      // setSelectedCover(cover);
      // router.push(`/cover/${id}`);
    },
    [
      id, 
      // router
  ]
  );

  const yearlyCost =
  coverName && validatorData[coverName]
      ? parseFloat(validatorData[coverName].yearlyCost.replace(" %", ""))
      : 0;

  return (
    <div className='flex w-full flex-col gap-20 rounded-15 bg-[#6B72801A] p-22 border border-[#6B7280]'>
      <div className='bg-[#FFFFFF0D] p-20 rounded-10'>
        <div className='flex items-center gap-[10px]'>
          <div className='h-[60px] w-[60px] overflow-hidden rounded-full'>
            <img src={CID} className='h-full w-full' alt='logo' />
          </div>
          <div className='flex flex-col gap-1'>
            <div className='text-lg font-semibold leading-[22px]'>
              {coverName}
            </div>
            <div className='flex items-center gap-1'>
              {/* <div className='h-5 w-5 rounded-full bg-white' /> */}
              {riskTypeName && (
                <div className='text-sm text-[#AFAFAF]'>{riskTypeName}</div>
              )}
            </div>
          </div>
        </div>
        <div className='my-40 flex flex-col gap-16'>
          {/* {items.map((item, i) => (
          <div key={i} className='text-base capitalize leading-[20px]'>
            {item}
          </div>
        ))} */}
          <div className='flex items-center justify-between text-base capitalize leading-[20px]'>
            <div>chains</div>
            <div className='font-semibold'>{chains}</div>
          </div>
          <div className='flex items-center justify-between text-base capitalize leading-[20px]'>
            <div>Annual Cost</div>
            <div className='font-semibold'>{yearlyCost} %</div>
          </div>
          <div className='flex items-center justify-between text-base capitalize leading-[20px]'>
            <div>Max Capacity</div>
            <div className='font-semibold'>{bnToNumber(maxAmount || 0n)}{' '}{assetName}</div>
          </div>
        </div>
      </div>
      <div className='flex justify-center w-full'>
        <Button
          size='lg'
          className='min-w-[216px] rounded-8 bg-gradient-to-r from-[#00ECBC66] to-[#00ECBC80] border border-[#00ECBC] w-full'
          wrapperClassName='w-full'
          onClick={() => handleCoverDetail(props.cover)}
          disabled={props.disabled}
        >
          Buy Cover
        </Button>
      </div>
    </div>
  );
};
