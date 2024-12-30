import React from "react";

type Props = {
  title: string;
}

const SectionTitle: React.FC<Props> = ({title}) => {
  return (
    <div className="w-full flex relative items-center justify-center">
      <h2 className="z-10 text-center font-[600] text-30 text-[#FFF] bg-[#000000] px-20 rounded-3xl">
        {title}
      </h2>
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
    </div>
  );
};

export default SectionTitle;