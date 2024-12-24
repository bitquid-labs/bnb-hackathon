import { useAllAvailableCovers } from "hooks/contracts/useAllAvailableCovers";
import { useAllUserCovers } from "hooks/contracts/useAllUserCovers";
import React, { useMemo, useState } from "react";
import { RiskType } from "types/common";
import List from "views/Covers/List";
import Search from "views/Covers/Search";
import { useAccount } from "wagmi";

const CoversPage: React.FC = () => {
  const { address } = useAccount();
  const availableCovers = useAllAvailableCovers();

  console.log("avaialbe:", availableCovers);

  const userCovers = useAllUserCovers(address as string);
  const userCoverIds = useMemo(() => userCovers.map((cover) => cover.coverId), [userCovers]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<RiskType | undefined>(undefined);

  const filteredCovers = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    if (filterCategory === undefined && !keyword) return availableCovers;

    return availableCovers.filter((cover) => {
      const matchesCategory = filterCategory === undefined || cover.riskType === filterCategory;

      const matchesSearch = keyword === "" || cover.coverName?.toLowerCase().includes(keyword);

      return matchesCategory && matchesSearch;
    });
  }, [availableCovers, searchKeyword, filterCategory]);

  return (
    <div className="w-full max-w-1220 mx-auto pt-70">
      <Search
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
      />
      <div className="mt-45">
        <List covers={filteredCovers} userCoverIds={userCoverIds} />
      </div>
    </div>
  );
};

export default CoversPage;
