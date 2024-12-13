import React from "react";
import { ICover } from "types/common";
import { Cover } from "./Cover";

type ListType = {
  covers: ICover[];
  userCoverIds: (bigint | undefined)[];
}

const List: React.FC<ListType> = ({covers, userCoverIds}) => {
  return (
    <div className='grid w-full grid-cols-3 gap-48'>
      {covers.map((cover: ICover, index) => (
        <Cover key={index} cover={cover} disabled={userCoverIds.includes(cover.id!)} />
      ))}
    </div>
  );
};

export default List;