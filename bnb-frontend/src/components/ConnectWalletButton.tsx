import React from "react";
import { connect, disconnect } from "@wagmi/core";
import { injected } from "@wagmi/connectors";
import config from "lib/config";
import Button from "./common/Button";
import { useAccount } from "wagmi";
import IconWalletHeader from "assets/icons/IconWalletHeader";

type ButtonProps = {
  className?: string;
};

const ConnectWalletButton: React.FC<ButtonProps> = ({ className }) => {
  const { address, connector } = useAccount();
  const truncateAddress = (address: string) => {
    return address.slice(0, 6) + "..." + address.slice(-4);
  };
  const handleConnect = async () => {
    await connect(config, { connector: injected() });
  };

  const handleDisconnect = async () => {
    await disconnect(config, {
      connector,
    });
  };

  return (
    <>
      {address ? (
        <Button
          className={className || "bg-[#F6F6F6] rounded-12 flex items-center gap-4 py-12 px-20 text-[#0A0A0A]"}
          onClick={handleDisconnect}
        >
          {truncateAddress(address)}
        </Button>
      ) : (
        <Button className="bg-[#F6F6F6] rounded-12 flex items-center gap-4 py-12 px-20" onClick={handleConnect}>
          <span className="text-[#0A0A0A]">Connect Wallet</span>
          <IconWalletHeader />
        </Button>
      )}
    </>
  );
};

export default ConnectWalletButton;
