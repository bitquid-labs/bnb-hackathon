import React, { ReactNode, useEffect, useState } from "react";
import { IIcon } from "types/common";

type WalletStatusProps = {
  title: string;
  iconComponent: (props: IIcon) => ReactNode | Promise<ReactNode>;
  balance: string;
};

const WalletStatus: React.FC<WalletStatusProps> = ({
  title,
  iconComponent,
  balance,
}) => {
  const [Icon, setIcon] = useState<ReactNode>(null);
  useEffect(() => {
    const loadIcon = async () => {
      const icon = await iconComponent({}); // Resolve the promise
      setIcon(icon);
    };
    loadIcon();
  }, [iconComponent]);
  
  return (
    <div className="w-full flex justify-around">
      <div className="">
        <div className="text-[#DCD9E0]">{title}</div>
        <div className="flex items-center justify-center">
          {Icon}
          <p className="font-[700] text-20 text-[#FFF]">{balance}</p>
        </div>
      </div>
    </div>
  );
};

export default WalletStatus;
