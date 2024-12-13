import React from "react";

import { IIcon } from "types/common";

const IconDown: React.FC<IIcon> = ({ className }) => {
  return (
    <svg
      className={className || ""}
      width="11"
      height="7"
      viewBox="0 0 11 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 1.625L5.49998 5.625L10 1.625"
        stroke="white"
        strokeWidth="2"
      />
    </svg>
  );
};

export default IconDown;
