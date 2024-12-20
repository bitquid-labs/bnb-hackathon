import Button from "components/common/Button";
import React from "react";

const Faucet: React.FC = () => {
  return (
    <div className="w-full flex items-start justify-between border border-[#6B7280] bg-[#6B72801A] px-40 py-62 rounded-32">
      <div className="w-[30%] flex flex-col justify-between items-start">
        <h2 className="text-24 font-[800] text-[#FFFFFF]">
          BqBtc Testnet Faucet
        </h2>
        <p className="text-14 text-[#FFFFFFA3] my-25">
          We support Bitlayer, BoB, Holesky, and lorenzo testnets.Soon we will
          onboard other chains as well.Connect your wallet, to get Testnet BqBtc
          and start Testing !
        </p>

        <Button size="lg" className="text-15 bg-[#F6F6F6] text-[#0A0A0A] rounded-12 ">Connect Wallet</Button>
      </div>
      <div className="w-[40%]">
        <h2 className="text-24 font-[800] text-[#FFFFFF]">How it works?</h2>
        <ul className="text-14 text-[#FFFFFFA3]">
          <li>Step 1: Connect wallet for available Network</li>
          <li>Step 2: Select BqBtc from dropdown</li>
          <li>Step 3: Get BqBtc</li>
          <li>Step 4: To see the tokens add BqBtc address in your wallet</li>
        </ul>
      </div>
    </div>
  );
};

export default Faucet;
