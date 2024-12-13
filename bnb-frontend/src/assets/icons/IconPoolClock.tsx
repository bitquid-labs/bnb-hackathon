import React from "react";

import { IIcon } from "types/common";

const IconPoolClock: React.FC<IIcon> = ({ className }) => {
  return (
    <svg
      className={className || ""}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.8356 6.99935C12.8356 10.2193 10.2223 12.8327 7.00228 12.8327C3.78228 12.8327 1.16895 10.2193 1.16895 6.99935C1.16895 3.77935 3.78228 1.16602 7.00228 1.16602C10.2223 1.16602 12.8356 3.77935 12.8356 6.99935Z"
        stroke="#CCA255"
        strokeWidth="1.19944"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9.16223 8.85698L7.35389 7.77781C7.03889 7.59115 6.78223 7.14198 6.78223 6.77448V4.38281"
        stroke="#CCA255"
        strokeWidth="1.19944"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default IconPoolClock;
