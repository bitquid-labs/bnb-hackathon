import SectionTitle from "components/common/SectionTitle";
import { getRiskTypeName } from "lib/number";
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
  return (
    <div className="w-full">
      <div className="w-full">
        <table className="w-full text-white">
          <thead className="">
            <tr className="[&>th]:text-20 [&th]:font-500 h-45">
              <th className=""></th>
              <th className="">Rating</th>
              <th className="">APY</th>
              <th className="">Min Tenure</th>
              <th className=""></th>
            </tr>
          </thead>
          <tbody>
            {coversData.map((cover, index) => (
              // <tr className="text-center px-8" key={index}>
              //   <td className="font-[400] bg-[#1F1F1F] py-24 rounded-l-8">
              //     {cover.coverName}
              //   </td>
              //   <td className="font-[500] bg-[#1F1F1F] py-24">{cover.rating}</td>
              //   <td className="font-[500] bg-[#1F1F1F] py-24">
              //     {Number(cover.apy)}%
              //   </td>
              //   <td className="font-[400] bg-[#1F1F1F] py-24 rounded-r-8">
              //     {Number(cover.minPeriod)}Days
              //   </td>
              //   <td className="bg-transparent">
              //     <button
              //       onClick={() => handleDeposit(Number(cover.id))}
              //       className="bg-[#00ECBC66] border border-[#00ECBC] px-45 py-7 rounded-8"
              //     >
              //       Invest
              //     </button>
              //   </td>
              // </tr>
              <></>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoversList;
