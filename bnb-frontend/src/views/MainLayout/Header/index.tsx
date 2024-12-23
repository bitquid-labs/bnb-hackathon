import React from "react";
import { Link, useLocation } from "react-router-dom";
import WalletButton from "./WalletButton";
import { headerLinks } from "../../../constants/routes";
import LogoImage from "assets/images/logo.png";
import ConnectWalletButton from "components/ConnectWalletButton";

const Header: React.FC = () => {
  const links = headerLinks;
  const { pathname } = useLocation();

  return (
    <div className="w-full bg-dark-200 text-white border-b-[1px] border-b-white/10 px-20 py-20 flex items-center gap-16 relative">
      <div className="w-full mx-auto flex justify-between items-center max-w-1220">
        <Link
          to="/dashboard"
          className="flex items-center justify-center gap-4 mr-20"
        >
          {/* <img src={logo} alt="logo" className="w-20" /> */}
          <span className="text-22 font-bold text-white hidden md:block">
            BQ Labs
          </span>
        </Link>
        <div className="flex justify-center items-center gap-">
          {links.map((link: any, index: any) => (
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
          ))}
        </div>

        {/* <nav className="flex items-center gap-32">
      </nav> */}
        <ConnectWalletButton />
      </div>
    </div>
  );
};

export default Header;
