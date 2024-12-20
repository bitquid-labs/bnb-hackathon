import Button from "components/common/Button";
import React from "react";

const IntroText: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <h2 className="text-50 font-[700]">
        Bitcoin <span className="text-[#00ECBC]">Risk Management Layer</span>
      </h2>
      <div className="text-18 font-[500] text-[#FFFFFFA3]">
        Securing Bitcoin Ecosystem with Decentralised Insurance Innovation.
      </div>
      <div className="flex items-center justify-center gap-20 mt-45">
        <Button
          size="lg"
          className="min-w-[216px] rounded-8 bg-gradient-to-r from-[#00ECBC66] to-[#00ECBC80] border border-[#00ECBC] w-full"
        >
          Connect Wallet
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="rounded-8"
        >
          Read BQ Labs Docs
        </Button>
      </div>
    </div>
  );
};

export default IntroText;
