import SectionTitle from "components/common/SectionTitle";
import { bnToNumber, getRiskTypeName } from "lib/number";
import React from "react";
import { IPool, IUserCover } from "types/common";
import IconDownIcon from "assets/icons/IconDown";
import networkBSCIcon from "assets/images/network_bsc.png";
import { formatEther } from "viem";
import { toast } from "react-toastify";

type IPoolWithDetails = IPool & {
  displayDetails: boolean;
};

type Props = {
  coversData: IUserCover[];
};

const CoversList: React.FC<Props> = ({ coversData }) => {
  console.log("coverdata:", coversData);
  const handleClaim = async (coverId: number) => {
    toast.info("Comming soon..")
  }

  return (
    <div className="w-full">
      <div className="w-full">
        <table className="w-full text-white border-separate border-spacing-y-25">
          <thead className="">
            <tr className="[&>th]:text-16 [&th]:font-500 h-45">
              <th className="border-b border-[#FFFFFF33]"></th>
              <th className="border-b border-[#FFFFFF33]">Cover Amount</th>
              <th className="border-b border-[#FFFFFF33]">Cover Expiry</th>
              <th className=""></th>
            </tr>
          </thead>
          <tbody>
            {coversData.map((cover, index) => (
              <tr className="text-center px-8" key={index}>
                <td className="font-[400] bg-[#1F1F1F] py-18 pl-20 rounded-l-8">
                  <div className="flex items-center gap-32">
                    <div className="w-30 h-30 rounded-fulll overflow-hidden bg-[#2B2B2B] rounded-full text-16 text-[#858584]">
                      {index}
                    </div>
                    <div className="w-47 h-47 flex items-center rounded-full overflow-hidden bg-[#FFFFFF]"></div>
                    <span>{cover.coverName}</span>
                  </div>
                </td>
                <td className="font-[500] bg-[#1F1F1F] py-18">
                  {bnToNumber(cover.coverValue)}
                </td>
                <td className="font-[500] bg-[#1F1F1F] py-18 rounded-r-8">
                  {Math.ceil(
                    (new Date(Number(cover.endDay) * 1000).getTime() -
                      new Date().getTime()) /
                    (1000 * 60 * 60 * 24)
                  )}{" "}
                  Days
                </td>
                <td className="bg-transparent pl-32">
                  <button
                    className="bg-[#1F1F1F] border border-gray-600 w-[7.3rem] h-[3.2rem] px-3 py-7 rounded-8 text-gray-700 cursor-not-allowed hover:bg-[#323232] group flex items-center justify-center  transition-all duration-300"
                    onClick={() => { }}
                    disabled
                  >
                    <span className="group-hover:hidden transition-opacity duration-300">Claim</span>
                    <span className="hidden group-hover:inline text-emerald-700 transition-opacity duration-300">Coming Soon</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoversList;
