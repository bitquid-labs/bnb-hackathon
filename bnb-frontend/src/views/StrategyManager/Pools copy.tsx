import React from "react";

const Pools: React.FC = () => {
  return (
    <div>
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
          <tr className="text-center">
            <td className="">Pool #1</td>
            <td className="">AAA</td>
            <td className="">3~5%</td>
            <td className="">2 months</td>
            <td className="">
              <button>
                Invest
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Pools;