import React from "react";
import UserStatus from "views/Dashboard/UserStatus";
import RiskCards from "views/Dashboard/RiskCards";
import SocialLinks from "views/Dashboard/SocialLInks";

const DashboardPage : React.FC = () => {
  return (
    <div className="w-full max-w-1220 mx-auto pt-70">
      <UserStatus />
      <RiskCards />
      <SocialLinks />
    </div>
  )
}

export default DashboardPage;