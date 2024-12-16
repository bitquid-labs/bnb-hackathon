import IconBitcoin from "assets/icons/IconBitcoin";
import { BQBTCTokenContract, VaultContract } from "constants/contracts";
import { ChainType } from "lib/wagmi";
import React, { useState } from "react";
import { parseUnits } from "viem";
import { useAccount, useWriteContract } from "wagmi";

const StrategyDetail: React.FC = () => {
  const [stakeAmount, setStakeAmount] = useState('');
  const {address, chain} = useAccount();
  const {writeContractAsync} = useWriteContract();

  const handleStake = async () => {
    const params = [
      1, // vaultId
      0, // amount
      32, // period
    ];

    try {
      await writeContractAsync({
        abi: VaultContract.abi,
        address: VaultContract.addresses[(chain as ChainType)?.chainNickName || 'bscTest'],
        functionName: 'vaultDeposit',
        args: params,
        value: parseUnits('0.01', 18)
      })
    } catch (e) {
      console.log("error:", e)
    }
  }

  const handleMintBQBTC = async () => {
    const params = [`${address}`, parseUnits('100', 18)]
    try {
      await writeContractAsync({
        abi: BQBTCTokenContract.abi,
        address:
          BQBTCTokenContract.addresses[(chain as ChainType)?.chainNickName],
        functionName: 'mint',
        args: params,
      });
      console.log('succeed minting')
    } catch (err) {
      let errorMsg = '';
      if (err instanceof Error) {
        if (err.message.includes('User denied transaction signature')) {
          errorMsg = 'User denied transaction signature';
        }
      }
      console.log('error minting')
    }
  }

  // const handleChangeStakeAmount = (value: string) => {

  // }
  return (
    <div className="w-full max-w-1220 mx-auto">
      {/* <button onClick={handleMintBQBTC}>Mint BQBTC</button> */}
      <div
        className="w-full rounded-40 overflow-hidden bg-gradient bg-gradient-to-b from-[#00ECBC33] to-[#83ACF000]"
        style={{
          // background: `
          //     linear-gradient(0deg, rgba(0, 0, 0, 0.67), rgba(0, 0, 0, 0.67)),
          //     radial-gradient(100% 100% at 50% 0%, rgba(0, 236, 188, 0.2) 0.27%, rgba(131, 172, 240, 0) 100%)
          //   `,
        }}
      >
        <div className="flex px-95 py-52 items-center justify-between">
          <div className="flex flex-col items-start justify-center">
            <div className="text-16 font-[700] text-[#00ECBC]">
              Strategy Name
            </div>
            <div className="relative z-[10]">
              <span className="font-[700] text-48">5-7%</span>
              <span className="text-19 ml-8">APY</span>
            </div>
          </div>
          <div className="flex items-end gap-22">
            <div className="flex flex-col">
              <span className="text-15 font-[600]">Enter Amount:</span>
              <div className="flex items-center gap-4 bg-[#07040D] py-8 px-12 rounded-8 overflow-hidden h-45">
                <IconBitcoin />
                <input
                  className="max-w-200 outline-none bg-transparent text-20 font-[700]"
                  value={stakeAmount}
                  onChange={(e) => {setStakeAmount(e.target.value)}}
                />
              </div>
            </div>
            <div 
              onClick={() => handleStake()}
            className="h-45 flex items-center justify-center  px-35 rounded-9 border border-[#6B728099] bg-gradient-to-r from-[rgba(0,236,188,0.8)] to-[rgba(32,81,102,0.096)] cursor-pointer">
              STAKE NOW
            </div>
          </div>
        </div>
        <div className="px-95 py-34 bg-[#1A1D22]">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start gap-7">
              <div className="text-[#9DA3BA] text-13 font-[500]">
                Min Investment
              </div>
              <div className="flex items-end">
                <span className="text-[#00ECBC] text-24 font-[700] leading-[25px]">
                  50
                </span>
                <span className="text-[#FFF] text-12 ml-4">USD</span>
              </div>
            </div>
            <div className="flex flex-col items-start gap-7">
              <div className="text-[#9DA3BA] text-13 font-[500]">
                Tenure Period
              </div>
              <div className="flex items-end">
                <span className="text-[#00ECBC] text-24 font-[700] leading-[25px]">
                  45
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
                  15,000
                </span>
                <span className="text-[#FFF] text-12 ml-4">USD</span>
              </div>
            </div>
            <div className="flex flex-col items-start gap-7">
              <div className="text-[#9DA3BA] text-13 font-[500]">
                Pools Invested:
              </div>
              <div className="flex items-end">
                <span className="text-[#00ECBC] text-24 font-[700] leading-[25px]">
                  AAA, BB, C
                </span>
                <span className="text-[#FFF] text-12 ml-4">{''}</span>
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

export default StrategyDetail;
