import { useConnectModal } from "@rainbow-me/rainbowkit";
import Button from "components/common/Button";
import ConnectWalletButton from "components/ConnectWalletButton";
import React from "react";
import btc from "../../assets/images/Cam1.png";

const IntroText: React.FC = () => {
  const { openConnectModal } = useConnectModal();

  return (
    <div className="w-full flex flex-col items-center justify-center relative">
      <div className="absolute right-[6rem] top-[-0.8rem]"><img src={btc} alt="" /></div>
      <h2 className="text-50 font-[700]">
        Bitcoin <span className="text-[#00ECBC]">Risk Management Layer</span>
      </h2>
      <div className="text-18 font-[500] text-[#FFFFFFA3]">
        Securing Bitcoin Ecosystem with Decentralised Insurance Innovation.
      </div>
      <div className="flex items-center justify-center gap-20 mt-45">
        {/* <Button
          size="lg"
          className="min-w-[216px] rounded-8 bg-gradient-to-r from-[#00ECBC66] to-[#00ECBC80] border border-[#00ECBC] w-full"
          onClick={openConnectModal}
        >
          Connect Wallet
        </Button> */}
        <ConnectWalletButton className="min-w-[216px] rounded-8 bg-gradient-to-r from-[#00ECBC66] to-[#00ECBC80] border border-[#00ECBC] w-full py-12" />
        <Button
          variant="outline"
          size="lg"
          className="rounded-8"
          onClick={() => window.open('https://docs.bqlabs.xyz/', '_blank')}
        >
          Read BQ Labs Docs
        </Button>

      </div>
    </div>
  );
};

export default IntroText;
