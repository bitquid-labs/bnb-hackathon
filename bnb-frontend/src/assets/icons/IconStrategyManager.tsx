import React from "react";

import { IIcon } from "types/common";

const IconStrategyManager: React.FC<IIcon> = ({ className }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className || ''}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.429 9.75L2.25 12L6.429 14.25M6.429 9.75L12 12.75L17.571 9.75M6.429 9.75L2.25 7.5L12 2.25L21.75 7.5L17.571 9.75M6.429 14.25L2.25 16.5L12 21.75L21.75 16.5L17.571 14.25M6.429 14.25L12 17.25L17.571 14.25M17.571 9.75L21.75 12L17.571 14.25"
        stroke="#E3E3E3"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconStrategyManager;
