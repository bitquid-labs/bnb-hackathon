import React from "react";

import { IIcon } from "types/common";

const IconArrowLeft: React.FC<IIcon> = ({ className }) => {
  return (
    <svg
      className={className || ""}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.625"
        y="0.625"
        width="18.75"
        height="18.75"
        rx="5.375"
        stroke="#C2C2C2"
        strokeWidth="1.25"
      />
      <path
        d="M11.1105 14.4086L11.8643 13.6549L8.37169 10.1623L11.8643 6.66973L11.1105 5.91602L6.86426 10.1623L11.1105 14.4086Z"
        fill="white"
      />
    </svg>
  );
};

export default IconArrowLeft;
