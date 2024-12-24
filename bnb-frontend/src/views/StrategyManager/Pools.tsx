// pages/BqLabsPools.tsx
import React from "react";
import IconDownIcon from "assets/icons/IconDown";

const Pools: React.FC = () => {
  const pools = [
    {
      poolName: "Pool #1",
      rating: "AAA",
      APY: "3–5%",
      tenure: "2 months",
      details: {
        network: "Bitcoin",
        tvl: "100k USD",
        investmentArm: "45",
        coverPurchase: "55",
        riskCovered: "Low",
        riskLevel: "Low",
      },
    },
    {
      poolName: "Pool #2",
      rating: "AAA",
      APY: "3–5%",
      tenure: "2 months",
      details: {
        network: "Bitcoin",
        tvl: "100k USD",
        investmentArm: "45",
        coverPurchase: "55",
        riskCovered: "Low",
        riskLevel: "Low",
      },
    },
  ];

  const isDetailsVisible = true;

  return (
    <div className="w-full px-45 py-37 border border-[#6B7280] rounded-20 bg-[#0b0c0d]">
      <div className="w-full flex relative items-center justify-center mb-20">
        <h2 className="z-10 text-center font-[600] text-30 text-[#FFF] bg-[#0b0c0d] px-4">BQ Labs Pools</h2>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
      </div>
      <table className="w-full text-white">
        <thead className="">
          <tr className="[&>th]:text-20 [&th]:font-500">
            <th className=""></th>
            <th className="">Rating</th>
            <th className="">APY</th>
            <th className="">Min Tenure</th>
            <th className=""></th>
          </tr>
        </thead>
        <tbody>
          {pools.map((pool, index) => (
            <>
              <tr className="text-center" key={index}>
                <td className="font-[400] bg-[#1F1F1F]">{pool.poolName}</td>
                <td className="font-[500] bg-[#1F1F1F]">{pool.rating}</td>
                <td className="font-[500] bg-[#1F1F1F]">{pool.APY}</td>
                <td className="font-[400] bg-[#1F1F1F]">{pool.tenure}</td>
                <td className="bg-transparent">
                  <button className="bg-[#00ECBC66] border border-[#00ECBC] px-45 py-7 rounded-8">
                    Invest
                  </button>
                </td>
              </tr>

              <tr className="text-center">
                <td className="font-[400] w-[80%] p-20 pt-0" colSpan={4}>
                  <div className="bg-[#3D3D3D]">
                    {!isDetailsVisible ? (
                      <></>
                    ) : (
                      <div className="flex w-full px-54">
                        <div className="flex w-[50%] flex-col items-center justify-center px-54">
                          <div className="flex items-center justify-between w-full">
                            <span className="text-22 font-[600]">Network</span>
                            <span>{pool.details.network}</span>
                          </div>
                          <div className="flex items-center justify-between w-full">
                            <span className="text-14 font-[400]">
                              Risk Covered
                            </span>
                            <span className="text-[#00ECBC] text-14 font-[600]">
                              {pool.details.riskCovered}
                            </span>
                          </div>
                        </div>
                        <div className="flex w-[50%] flex-col items-center justify-center px-54">
                          <div className="flex items-center justify-between w-full">
                            <span className="text-14 font-[400]">TVL</span>
                            <span className="text-14 font-[400]">
                              {pool.details.tvl}
                            </span>
                          </div>
                          <div className="flex items-center justify-between w-full">
                            <span className="text-14 font-[400]">
                              Investment Arm %
                            </span>
                            <span className="text-14 font-[400]">
                              {pool.details.investmentArm} %
                            </span>
                          </div>
                          <div className="flex items-center justify-between w-full">
                            <span className="text-14 font-[400]">
                              Cover Purchase %
                            </span>
                            <span className="text-14 font-[400]">
                              {pool.details.coverPurchase} %
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div
                      className="w-full flex items-center justify-center gap-5 cursor-pointer"
                      onClick={() => {}}
                    >
                      <span>More Details</span> <IconDownIcon />
                    </div>
                  </div>
                </td>
              </tr>
            </>
          ))}
          {/* <tr className="text-center">
            <td className="font-[400] bg-[#1F1F1F]">Pool #1</td>
            <td className="font-[500] bg-[#1F1F1F]">AAA</td>
            <td className="font-[500] bg-[#1F1F1F]">3~5%</td>
            <td className="font-[400] bg-[#1F1F1F]">2 months</td>
            <td className="bg-transparent">
              <button className="bg-[#00ECBC66] border border-[#00ECBC] px-45 py-7 rounded-8">
                Invest
              </button>
            </td>
          </tr>
          <tr className="text-center">
            <td className="font-[400] bg-[#3D3D3D] w-[80%]" colSpan={4}>
              <div>
                {!isDetailsVisible ? (
                  <></>
                ) : (
                  <div className="flex w-full px-54">
                    <div className="flex w-[50%] flex-col items-center justify-center px-54">
                      <div className="flex items-center justify-between w-full">
                        <span>Network</span>
                        <span>Bitcoin</span>
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <span>Risk Covered</span>
                        <span>Low</span>
                      </div>
                    </div>
                    <div className="flex w-[50%] flex-col items-center justify-center px-54">
                      <div className="flex items-center justify-between w-full">
                        <span>TVL</span>
                        <span>100K USD</span>
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <span>TVL</span>
                        <span>100K USD</span>
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <span>TVL</span>
                        <span>100K USD</span>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-center gap-5">
                  <span>More Details</span> <IconDownIcon />
                </div>
              </div>
            </td>
          </tr> */}
        </tbody>
      </table>
    </div>
  );
};

export default Pools;
