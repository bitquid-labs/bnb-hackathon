import React from "react";

import { IIcon } from "types/common";

const IconYieldChart: React.FC<IIcon> = ({ className }) => {
  return (
    <svg
      className={className || ""}
      width="15"
      height="14"
      viewBox="0 0 15 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.5 13V4.27273M5.5 13V8.63636M9.5 13V1M13.5 13V7"
        stroke="#179077"
        strokeWidth="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default IconYieldChart;
