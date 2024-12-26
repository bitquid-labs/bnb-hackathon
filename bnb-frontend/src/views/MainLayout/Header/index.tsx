import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import WalletButton from "./WalletButton";
import { headerLinks } from "../../../constants/routes";
import LogoImage from "assets/images/logo.png";
import ConnectWalletButton from "components/ConnectWalletButton";
import { cn } from "lib/utils";

const Header: React.FC = () => {
  const links = headerLinks;
  const { pathname } = useLocation();
  const navigate = useNavigate();

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
                <div className="border border-[#FFFFFF1A] text-light bg-[#1E1E1EB2] py-10 px-24 rounded-[10px] absolute left-1/2 top-full hidden w-max min-w-[200px] -translate-x-1/2 flex-col p-2 [box-shadow:0px_0px_24px_0px_rgba(0,_0,_0,_0.08)] group-hover:flex">
                  {link.subMenus?.map((menu: any, index: any) => (
                    <div
                      key={index}
                      className="relative flex cursor-pointer items-center"
                      onClick={() => navigate(menu.url)}
                    >
                      <p className="text-[#8D8D8D] text-12 py-8 hover:bg-gradient-to-t hover:text-[#FFF]">
                        {menu.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
