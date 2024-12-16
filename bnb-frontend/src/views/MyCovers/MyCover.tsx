import React, { useCallback } from 'react';

import Button from 'components/common/Button';
import { IUserCover } from 'types/common';
import { useAccount } from 'wagmi';
import { useCoverInfo } from 'hooks/contracts/useCoverInfo';
import { useNavigate } from 'react-router';

import { bnToNumber, UNIXToDate } from 'lib/number';
import { getRiskTypeName } from 'lib/number';



export type CoverProps = {
  onSubmit?: () => void;
} & IUserCover;

export const MyCover: React.FC<CoverProps> = (props) => {
  const {
    coverId,
    coverName,
    coverValue: coverValueBN,
    endDay: endTimeStamp,
    riskType,
  } = props;
  const endDate = UNIXToDate(endTimeStamp || 0n);
  const navigate = useNavigate();
  const riskTypeName = getRiskTypeName(riskType);

  const coverValue = bnToNumber(coverValueBN || 0n);

  const coverInfo = useCoverInfo(Number(coverId));

  const handleLinkDetail = useCallback(() => {
    navigate(`/claim/?coverId=${coverId}`);
  }, [coverId, navigate]);

  return (
    <div className='flex w-full flex-col gap-5 rounded-[5px] bg-[#1E1E1E] p-12'>
      <div className='bg-gradient-to-r from-[#3D3D3D] to-[#303030] p-20'>
        <div className='flex items-center gap-[10px]'>
          <div className='h-[60px] w-[60px] overflow-hidden rounded-full'>
            <img src={coverInfo?.CID} className='h-full w-full' alt='logo' />
          </div>
          <div className='flex flex-col gap-4'>
            <div className='text-lg font-semibold leading-[22px]'>
              {coverName}
            </div>
            <div className='flex items-center gap-4'>
              {/* <div className='h-5 w-5 rounded-full bg-white' /> */}
              {riskTypeName && <div className='text-sm'>{riskTypeName}</div>}
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-16'>
          <div className='flex items-center justify-between'>
            <div>Cover value</div>
            <div>{coverValue}</div>
          </div>
          <div className='flex items-center justify-between'>
            <div>Cover Expiry</div>
            <div>{endDate.toLocaleDateString()}</div>
          </div>
        </div>
      </div>
      <div className='flex justify-center'>
        <Button
          variant='primary'
          size='lg'
          className='min-w-[216px] rounded-sm bg-gradient-to-r from-[#00ECBC] to-[#005746]'
          onClick={handleLinkDetail}
        >
          Claim Cover
        </Button>
      </div>
    </div>
  );
};
