import React from "react";

import { IIcon } from "types/common";

const IconInfo: React.FC<IIcon> = ({ className }) => {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      className={className || ''}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.125 4C0.125 1.8599 1.8599 0.125 4 0.125H13C15.1401 0.125 16.875 1.8599 16.875 4V13C16.875 15.1401 15.1401 16.875 13 16.875H4C1.8599 16.875 0.125 15.1401 0.125 13V4Z"
        fill="url(#paint0_linear_139_3962)"
        stroke="#5B5B5B"
        strokeWidth="0.25"
      />
      <rect
        x="4.43457"
        y="3.69531"
        width="8.13043"
        height="8.86957"
        fill="url(#pattern0_139_3962)"
      />
      <defs>
        <pattern
          id="pattern0_139_3962"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            transform="matrix(0.00213068 0 0 0.00195312 -0.0454545 0)"
          />
        </pattern>
        <linearGradient
          id="paint0_linear_139_3962"
          x1="17"
          y1="8.5"
          x2="0"
          y2="8.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#3D3D3D" />
          <stop offset="1" stop-color="#303030" />
        </linearGradient>
        <image
          id="image0_139_3962"
          width="512"
          height="512"
        />
      </defs>
    </svg>
  );
};

export default IconInfo;
