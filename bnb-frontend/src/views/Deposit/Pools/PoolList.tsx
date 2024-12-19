import SectionTitle from "components/common/SectionTitle";
import { getRiskTypeName } from "lib/number";
import React from "react";
import { IPool } from "types/common";
import IconDownIcon from "assets/icons/IconDown";

type IPoolWithDetails = IPool & {
  displayDetails: boolean;
};

type Props = {
  poolData: IPoolWithDetails[];
  handleDeposit: (poolId: number) => void;
  sectionTitle: string;
  setPoolsData: (prev: any) => void;
};

const PoolList: React.FC<Props> = ({ poolData, handleDeposit, sectionTitle, setPoolsData }) => {
  return (
    <div className="w-full">
      <div className="mt-80 mb-57">
        <SectionTitle title={sectionTitle} />
      </div>
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
            {poolData.map((pool, index) => (
              <>
                <tr className="text-center px-8">
                  <td className="font-[400] bg-[#1F1F1F] py-24 rounded-l-8">
                    {pool.poolName}
                  </td>
                  <td className="font-[500] bg-[#1F1F1F] py-24">{"AAA"}</td>
                  <td className="font-[500] bg-[#1F1F1F] py-24">{pool.apy}</td>
                  <td className="font-[400] bg-[#1F1F1F] py-24 rounded-r-8">
                    {pool.minPeriod}
                  </td>
                  <td className="bg-transparent">
                    <button
                      onClick={() => handleDeposit(Number(pool.id))}
                      className="bg-[#00ECBC66] border border-[#00ECBC] px-45 py-7 rounded-8"
                    >
                      Invest
                    </button>
                  </td>
                </tr>

                <tr className="text-center">
                  <td className="font-[400] w-[80%] p-20 pt-0" colSpan={4}>
                    <div className="bg-[#3D3D3D] rounded-b-4">
                      {!pool.displayDetails ? (
                        <></>
                      ) : (
                        <div className="flex w-full px-45 py-25">
                          <div className="flex w-[50%] flex-col items-center justify-center px-54">
                            <div className="flex items-center justify-between w-full">
                              <span className="text-22 font-[600]">
                                Network
                              </span>
                              <span>{"Bitcoin"}</span>
                              {/* <span>{pool.details.network}</span> */}
                            </div>
                            <div className="flex items-center justify-between w-full">
                              <span className="text-14 font-[400]">
                                Risk Covered
                              </span>
                              <span className="text-[#00ECBC] text-14 font-[600]">
                                {getRiskTypeName(pool.riskType)}
                              </span>
                            </div>
                          </div>
                          <div className="flex w-[50%] flex-col items-center justify-center px-54">
                            <div className="flex items-center justify-between w-full">
                              <span className="text-14 font-[400]">TVL</span>
                              <span className="text-14 font-[800]">
                                {pool.tvl}
                              </span>
                            </div>
                            <div className="flex items-center justify-between w-full">
                              <span className="text-14 font-[400]">
                                Investment Arm %
                              </span>
                              <span className="text-14 font-[800]">
                                {Number(pool.investmentArmPercent)} %
                              </span>
                            </div>
                            <div className="flex items-center justify-between w-full">
                              <span className="text-14 font-[400]">
                                Cover Purchase %
                              </span>
                              <span className="text-14 font-[800]">
                                {100 - Number(pool.investmentArmPercent)} %
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div
                        className="w-full flex items-center justify-center gap-5 cursor-pointer py-8"
                        onClick={() => {
                          setPoolsData((prev: any) =>
                            prev.map((pool: any, i: number) =>
                              i === index
                                ? {
                                    ...pool,
                                    displayDetails: !pool.displayDetails,
                                  }
                                : pool
                            )
                          );
                        }}
                      >
                        <span>More Details</span> <IconDownIcon />
                      </div>
                    </div>
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PoolList;
