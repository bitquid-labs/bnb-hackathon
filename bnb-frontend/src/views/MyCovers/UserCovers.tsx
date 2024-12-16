import { useAllUserCovers } from "hooks/contracts/useAllUserCovers";
import React from "react";
import { useAccount } from "wagmi";
import { MyCover } from "./MyCover";

const UserCovers: React.FC = () => {
  const { address } = useAccount();
  const userCovers = useAllUserCovers(address as string);

  return (
    <div className="grid w-full grid-cols-3 gap-38">
      {userCovers.map((userCover, index) => (
        <MyCover key={index} {...userCover} />
      ))}
    </div>
  );
};

export default UserCovers;
