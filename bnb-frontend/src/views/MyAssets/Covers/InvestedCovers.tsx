import { useAllUserCovers } from "hooks/contracts/useAllUserCovers";
import { bnToNumber } from "lib/number";
import React from "react";
import { useAccount } from "wagmi";

const InvestedCovers: React.FC = () => {
  const { address } = useAccount();
  const userCovers = useAllUserCovers(address as string);

  const handleWithdraw = async (coverId: number) => {
    
  }

  return (
    <div className="w-full">
      <table className="w-full text-white border-spacing-y-20 border-separate">
        <thead className="">
          <tr className="[&>th]:text-20 [&th]:font-500 h-45">
            <th className=""></th>
            <th className="">APY</th>
            <th className="">Cover Amount</th>
            <th className="">Cover Expiry</th>
            <th className=""></th>
          </tr>
        </thead>
        <tbody>
          {userCovers.map((cover, index) => (
            <>
              <tr className="text-center px-8" key={index}>
                <td className="font-[400] bg-[#1F1F1F] py-18 rounded-l-8 pl-20">
                  <div className="flex items-center">
                    <div className="w-30 h-30 flex items-center justify-center rounded-full text-[#858584] bg-[#2B2B2B]">{index}</div>
                    <div className="w-47 h-47 ml-20 rounded-full bg-[#FFF] overflow-hidden"></div>
                    <span className="ml-34 text-[#FFF]">
                      {cover.coverName}
                    </span>
                  </div>
                </td>
                <td className="font-[500] bg-[#1F1F1F] py-18">{"3-5%"}</td>
                <td className="font-[500] bg-[#1F1F1F] py-18">
                  {bnToNumber(cover.coverValue)}
                </td>
                <td className="font-[400] bg-[#1F1F1F] py-18 rounded-r-8 text-center">
                  {Math.floor(
                    (Number(cover.endDay) * 1000 - Date.now()) / 86400000
                  )}{" "}
                  {"Days"}
                </td>
                <td>
                  <button
                    onClick={() => {handleWithdraw(Number(cover.coverId))}}
                    className="bg-[#00ECBC66] border border-[#00ECBC] px-45 py-7 rounded-8"
                  >
                    Withdraw
                  </button>
                </td>
                {/* <td className="bg-transparent">
                  <button
                    onClick={() => handleDeposit(Number(pool.id))}
                    className="bg-[#00ECBC66] border border-[#00ECBC] px-45 py-7 rounded-8"
                  >
                    Invest
                  </button>
                </td> */}
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvestedCovers;
