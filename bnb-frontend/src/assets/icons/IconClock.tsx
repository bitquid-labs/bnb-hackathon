import React from "react";

import { IIcon } from "types/common";

const IconClock: React.FC<IIcon> = ({ className }) => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={className || ''}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.8337 6.99935C12.8337 10.2193 10.2203 12.8327 7.00033 12.8327C3.78033 12.8327 1.16699 10.2193 1.16699 6.99935C1.16699 3.77935 3.78033 1.16602 7.00033 1.16602C10.2203 1.16602 12.8337 3.77935 12.8337 6.99935Z"
        stroke="white"
        strokeWidth="1.19944"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9.16027 8.85698L7.35194 7.77781C7.03694 7.59115 6.78027 7.14198 6.78027 6.77448V4.38281"
        stroke="white"
        strokeWidth="1.19944"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default IconClock;
