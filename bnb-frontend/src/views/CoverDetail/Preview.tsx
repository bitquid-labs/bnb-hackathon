import Button from 'components/common/Button';
import { BQBTC } from 'constants/config';
import { formatDate } from 'lib/number';
import React from 'react';
import { useAccount } from 'wagmi';

type PreviewProps = {
  handleBuyCover: () => void;
  error: string;
  productName: string;
  coverAmount: string;
  annualCost: number;
  coverFee: number;
  coverPeriod: number;
  logo: string;
  isLoading: boolean;
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
  } = props;

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate((startDate.getDate() + coverPeriod) | 0);
  const {address}  = useAccount();

  return (
    <div className='w-full h-full flex flex-col justify-between'>
      <div className='relative flex flex-col gap-4 rounded-10 border border-[#FFFFFF33] bg-[#FFFFFF0D] px-25 py-50'>
        <div className='flex flex-col gap-12'>
          <div className='flex items-center justify-between'>
            <div>Product</div>
            <div className='flex items-center gap-[10px]'>
              <div className='h-[32px] w-[32px] bg-[#D9D9D9] rounded-full overflow-hidden'>
                <img className="w-full" src={logo} alt='cover-logo' />
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
          <div className='flex items-center justify-between'>
            <div className='flex gap-[10px]'>
              <div>Cover amount</div>
              {/* <div className='bg-background-200 h-5 w-5 rounded-full' /> */}
            </div>
            <div className='flex gap-[10px]'>
              <div className='font-semibold'>
                {coverAmount} {BQBTC.symbol}
              </div>
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex gap-[10px]'>
              <div>Cover period</div>
              {/* <div className='bg-background-200 h-5 w-5 rounded-full' /> */}
            </div>
            <div className='font-semibold'>
              {formatDate(startDate)} - {formatDate(endDate)}
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex gap-[10px]'>
              <div>Yearly Cost</div>
              {/* <div className='bg-background-200 h-5 w-5 rounded-full' /> */}
            </div>
            <div className='font-semibold'>{annualCost}%</div>
          </div>
          <div className='bg-border-100 h-[0.5px] w-full'></div>
        </div>
        <div className='w-full h-1 bg-[#FFF] mb-12' />
        <div className='flex items-center justify-between'>
          <div className='text-14 font-[600]'>Cover fee</div>
          <div className='flex items-center gap-2'>
            {!!coverFee && <div>{coverFee.toFixed(coverFee ? Math.max(Math.round(Math.log10(1 / Math.abs(coverFee))), 5) : 5)}</div>}
            {/* <Dropdown
              value={selectedToken}
              setValue={setSelectedToken}
              options={['WBTC', 'WETH', 'USDC']}
            /> */}
            <div className='ml-10 rounded-6 bg-[#D9D9D933] px-[25px] py-[5px]'>
              {BQBTC.symbol}
            </div>
          </div>
        </div>
      </div>
      <div className='flex justify-center mt-20'>
        {address && (
          <Button
            isLoading={isLoading}
            className='w-fit min-w-302 rounded-8 bg-gradient-to-r from-[#00ECBC66] to-[#00ECBC80] py-16 text-center border border-[#00ECBC]'
            onClick={handleBuyCover}
            disabled={!!error}
          >
            {error || 'Buy Cover'}
          </Button>
        )}
        {!address && <button>Connect Wallet</button>}
      </div>
    </div>
  );
}

export default Preview;