import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import WalletButton from "./WalletButton";
import { headerLinks } from "../../../constants/routes";
import LogoImage from "assets/images/logo.png";
import ConnectWalletButton from "components/ConnectWalletButton";
import { cn } from "lib/utils";
import IconLogo from "assets/icons/IconLogo";
import EthereumLogo from "assets/icons/ethereum-logo.png";
import BnbLogo from "assets/icons/bnb-logo.png"; 

const Header: React.FC = () => {
  const links = headerLinks;
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [currentNetwork, setCurrentNetwork] = useState("bnb");

  const handleNetworkChange = async () => {
    if (window.ethereum) {
      try {
        if (currentNetwork === "bnb") {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x1" }], // Ethereum Mainnet
          });
          setCurrentNetwork("eth");
          toast.success("Switched to Ethereum Mainnet");
        } else {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x61" }], // BNB Smart Chain Testnet
          });
          setCurrentNetwork("bnb");
          toast.success("Switched to BNB Smart Chain Testnet");
        }
      } catch (error) {
        console.error("Failed to switch network", error);
        toast.error("Failed to switch network");
      }
    } else {
      alert("MetaMask or compatible wallet not found.");
    }
  };

  return (
    <div>
      <div className="bg-gradient-to-t from-black via-black to-emerald-900 absolute h-[15rem] z-[-1] blur-[100rem] w-full"></div>
      <div className="w-full bg-dark-200 text-white border-b-[1px] border-b-white/10 px-20 py-20 flex items-center gap-16 relative">
        <div className="flex items-center justify-between w-full mx-auto max-w-1220">
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-4 mr-20"
          >
            <IconLogo />
          </Link>
          <div className="flex items-center justify-center gap-">
            {links.map((link: any, index: any) => (
              <div className={cn("group relative flex flex-auto")}>
                <Link
                  to={link.url}
                  target={!link.url.startsWith("/") ? "_blank" : undefined}
                  key={index}
                  className={`hover:text-white border-b-2 border-t-2 border-transparent m-transition-color hidden md:flex md:justify-center md:items-center ${
                    pathname.includes(link.url)
                      ? " text-white border-b-primary"
                      : "text-light-300"
                  }`}
                >
                  <div
                    className={`flex gap-10 items-center justify-center py-12 px-25 ${
                      pathname.includes(link.url)
                        ? "border border-[#FFFFFF66] bg-[#E6E6E61A] rounded-10"
                        : ""
                    }`}
                  >
                    <div className="relative w-18 h-18">
                      <link.icon className="w-18 h-18" />
                      {pathname.includes(link.url) && (
                        <div className="absolute w-0 h-0 top-1/2 left-1/2 text-white rounded-lg before:content-[''] before:absolute before:inset-0 before:rounded-lg shadow-[0_0_50px_20px_rgba(255,255,255,0.8)]"></div>
                      )}
                    </div>
                    {link.name}
                  </div>
                </Link>
                {link.subMenus && link.subMenus.length > 0 && (
                  <div className="border border-[#FFFFFF1A] text-light bg-[#1E1E1EB2] py-10 px-24 rounded-[10px] absolute left-1/2 top-full hidden w-max min-w-[150px] -translate-x-1/2 flex-col p-2 [box-shadow:0px_0px_24px_0px_rgba(0,_0,_0,_0.08)] group-hover:flex">
                    {link.subMenus?.map((menu: any, index: any) => (
                      <>
                        <div
                          key={index}
                          className={cn(
                            "relative flex cursor-pointer items-center"
                          )}
                          onClick={() => navigate(menu.url)}
                        >
                          <p className="w-full text-[#8D8D8D] text-12 py-8 hover:bg-gradient-to-t hover:text-[#FFF]">
                            {menu.name}
                          </p>
                        </div>
                        {index < link.subMenus.length - 1 && (
                          <div className="w-full h-1 bg-gradient-to-r from-[#888888] via-[#7E7E7E00] to-[#888888]"></div>
                        )}
                      </>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-10">
            <button
              onClick={handleNetworkChange}
              className=""
            >
              {currentNetwork === "bnb" ? (
                <img src={BnbLogo} alt="BNB" className="w-36 rounded-full" />
              ) : (
                <img src={EthereumLogo} alt="Ethereum" className="w-36 rounded-full" />
              )}
            </button>
            <ConnectWalletButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
