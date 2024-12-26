import SectionTitle from "components/common/SectionTitle";
import { bnToNumber, getRiskTypeName } from "lib/number";
import React from "react";
import { IPool, IUserCover } from "types/common";
import IconDownIcon from "assets/icons/IconDown";
import networkBSCIcon from "assets/images/network_bsc.png";
import { formatEther } from "viem";

type IPoolWithDetails = IPool & {
  displayDetails: boolean;
};

type Props = {
  coversData: IUserCover[];
};

const CoversList: React.FC<Props> = ({ coversData }) => {
  console.log("coverdata:", coversData);
  return (
    <div className="w-full">
      <div className="w-full">
        <table className="w-full text-white border-spacing-y-1">
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
                <td className="font-[400] bg-[#1F1F1F] py-24 pl-20 rounded-l-8">
                  <div className="flex items-center gap-32">
                    <div className="w-30 h-30 rounded-fulll overflow-hidden bg-[#2B2B2B] rounded-full text-16 text-[#858584]">
                      {index}
                    </div>
                    <div className="w-47 h-47 flex items-center rounded-full overflow-hidden bg-[#FFFFFF]"></div>
                    <span>{cover.coverName}</span>
                  </div>
                </td>
                <td className="font-[500] bg-[#1F1F1F] py-24">
                  {bnToNumber(cover.coverValue)}
                </td>
                <td className="font-[500] bg-[#1F1F1F] py-24">
                  {Math.ceil(
                    (new Date(Number(cover.endDay) * 1000).getTime() -
                      new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  Days
                </td>
                <td className="bg-transparent">
                  <button
                    onClick={() => {}}
                    className="bg-[#00ECBC66] border border-[#00ECBC] px-45 py-7 rounded-8"
                  >
                    Claim
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
