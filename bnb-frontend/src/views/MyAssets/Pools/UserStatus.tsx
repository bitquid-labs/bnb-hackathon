import React from "react";
import WalletStatus from "components/WalletStatus";
import IconMetamask from "assets/icons/IconMetamask";
import IconBitcoin from "assets/icons/IconBitcoin";

const UserStatus: React.FC = () => {
  return (
    <div className="w-full flex py-30 justify-between border border-[#6B7280] rounded-12 bg-[#6B72801A]">
      <WalletStatus
        title="Your Wallet:"
        iconComponent={IconMetamask}
        balance="0EX030...023"
      />
      <WalletStatus
        title="Wallet Balance:"
        iconComponent={IconBitcoin}
        balance="10,000.2 $"
      />
      <WalletStatus
        title="Total Staked:"
        iconComponent={IconBitcoin}
        balance="30,000.23 $"
      />
      <WalletStatus
        title="Total Rewards:"
        iconComponent={IconBitcoin}
        balance="4,323.49 $"
      />
    </div>
  );
};

export default UserStatus;
