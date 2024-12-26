import SectionTitle from "components/common/SectionTitle";
import React, { useState } from "react";
import IntroText from "views/Dashboard/IntroText";
import UserCovers from "views/MyCovers/UserCovers";
import { filters } from "views/Covers/constants";
import Search from "views/MyCovers/Search";
import { RiskType } from "types/common";
import { useAccount } from "wagmi";
import { useAllUserCovers } from "hooks/contracts/useAllUserCovers";
import CoversList from "views/MyCovers/CoversList";

const MyCoversPage: React.FC = () => {
  const { address } = useAccount();
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<RiskType | undefined>(
    undefined
  );
  const userCovers = useAllUserCovers(address as string);

  return (
    <div className="w-full max-w-1220 mx-auto pt-70">
      <SectionTitle title="Invested Covers Overview" />
      <div className="mt-42">
        <Search
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
        />
        {/* <CoversList
          poolData={userCovers}
        /> */}
      </div>
    </div>
  );
};

export default MyCoversPage;
