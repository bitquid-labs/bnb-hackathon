// import { useRouter } from 'next/navigation';
import React, { useCallback, useContext, useMemo } from 'react';

import Button from 'components/common/Button';

import { ICover } from 'types/common';
// import { CoverContext } from '@/contexts/CoverContext';
import { bnToNumber, getRiskTypeName } from 'lib/number';

export type CoverProps = {
  cover: ICover,
  disabled: boolean;
};

export const Cover: React.FC<CoverProps> = (props) => {
  const { coverName, chains, cost, capacity, id, riskType, maxAmount, CID } =
    props.cover;
  const riskTypeName = getRiskTypeName(riskType);
  const annualCost = useMemo(() => {
    return Number(cost);
  }, [cost]);

  // const { setSelectedCover } = useContext(CoverContext)!;
  // const router = useRouter();

  const handleLinkDetail = useCallback(
    (cover: ICover) => {
      // setSelectedCover(cover);
      // router.push(`/cover/${id}`);
    },
    [
      id, 
      // router
  ]
  );

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
            <div className='font-semibold'>{annualCost} %</div>
          </div>
          <div className='flex items-center justify-between text-base capitalize leading-[20px]'>
            <div>Max Capacity</div>
            <div className='font-semibold'>{bnToNumber(maxAmount || 0n)}{' '}BTC</div>
          </div>
        </div>
      </div>
      <div className='flex justify-center w-full'>
        <Button
          size='lg'
          className='min-w-[216px] rounded-8 bg-gradient-to-r from-[#00ECBC66] to-[#00ECBC80] border border-[#00ECBC] w-full'
          wrapperClassName='w-full'
          onClick={() => handleLinkDetail(props.cover)}
          disabled={props.disabled}
        >
          Buy Cover
        </Button>
      </div>
    </div>
  );
};
