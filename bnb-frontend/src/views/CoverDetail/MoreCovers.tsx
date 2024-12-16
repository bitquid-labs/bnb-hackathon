import { useAllAvailableCovers } from "hooks/contracts/useAllAvailableCovers";
import React, { useMemo } from "react";
import { ICover, RiskType } from "types/common";
import { Cover } from "views/Covers/Cover";

type MoreCoversType = {
  currentCoverId: number | undefined;
  riskType: RiskType | undefined;
};

const MoreCovers: React.FC<MoreCoversType> = ({ currentCoverId, riskType }) => {
  const availableCovers = useAllAvailableCovers();
  const moreCovers = useMemo(() => {
    if (riskType === undefined) return [];

    return availableCovers.filter(
      (cover) => cover.riskType === riskType && Number(cover.id) !== currentCoverId
    );
  }, [availableCovers, riskType, currentCoverId]);

  return (
    <div className="grid w-full grid-cols-3 gap-48">
      {moreCovers.map((cover: ICover, index) => (
        <Cover key={index} cover={cover} disabled={false} />
      ))}
    </div>
  );
};

export default MoreCovers;
