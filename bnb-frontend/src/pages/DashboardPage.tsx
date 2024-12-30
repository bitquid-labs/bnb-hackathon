import React from "react";
import SocialLinks from "components/SocialLInks";
import IntroText from "views/Dashboard/IntroText";
import Features from "views/Dashboard/Features";
import Faucet from "views/Dashboard/Faucet";
import ConnectWalletButton from "components/ConnectWalletButton";

const DashboardPage: React.FC = () => {
  return (
    <div>
    <div className="bg-gradient-to-t from-black via-black to-emerald-900 absolute h-[60rem] blur-[100rem] w-full"></div>
    <div className="w-full max-w-1220 mx-auto pt-70 ">
      <IntroText />
      <div className="mt-98">
        <Features />
      </div>
      <div className="mt-77">
        <Faucet />
      </div>
      <div className="my-95 w-full bg-gradient bg-gradient-to-r from-[#FFFFFF] to-[#161618] h-2"></div>
      <SocialLinks />
    </div>
    </div>

  );
};

export default DashboardPage;
