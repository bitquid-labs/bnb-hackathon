import React from "react";
import { IIcon } from "types/common";

type WalletStatusProps = {
  title: string;
  iconComponent: React.FC<IIcon>;
  balance: string;
};

const WalletStatus: React.FC<WalletStatusProps> = ({
  title,
  iconComponent,
  balance,
}) => {
  return (
    <div className="w-full flex justify-around">
      <div className="">
        <div className="text-[#DCD9E0]">{title}</div>
        <div className="flex items-center justify-center">
          {iconComponent({})}
          <p className="font-[700] text-20 text-[#FFF]">{balance}</p>
        </div>
      </div>
    </div>
  );
};

export default WalletStatus;
