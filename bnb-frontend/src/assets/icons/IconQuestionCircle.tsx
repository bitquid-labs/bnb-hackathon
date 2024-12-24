import React from "react";

import { IIcon } from "types/common";

const IconQuestionCircle: React.FC<IIcon> = ({ className }) => {
  return (
    <svg
      className={className || ""}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.48" clip-path="url(#clip0_842_518)">
        <path
          d="M4.57324 4.53681C4.65864 4.27366 4.81508 4.03948 5.02539 3.85974C5.23571 3.68 5.4919 3.56189 5.76514 3.51854C6.03838 3.47519 6.31811 3.5082 6.57373 3.61401C6.82935 3.71983 7.05072 3.89437 7.21338 4.11816C7.37603 4.34195 7.47344 4.60628 7.49518 4.88208C7.51693 5.15788 7.46192 5.43439 7.33634 5.68091C7.21077 5.92742 7.01969 6.13425 6.7838 6.27881C6.54792 6.42337 6.27666 6.49988 6 6.49988V7.00012M6 10.5C3.51472 10.5 1.5 8.48528 1.5 6C1.5 3.51472 3.51472 1.5 6 1.5C8.48528 1.5 10.5 3.51472 10.5 6C10.5 8.48528 8.48528 10.5 6 10.5ZM6.0249 8.5V8.55L5.9751 8.5501V8.5H6.0249Z"
          stroke="white"
          stroke-width="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_842_518">
          <rect width="12" height="12" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default IconQuestionCircle;
