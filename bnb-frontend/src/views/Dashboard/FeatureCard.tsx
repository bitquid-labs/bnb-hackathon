import React from "react";
import IconQuestionCircle from "assets/icons/IconQuestionCircle";

type Props = {
  title: string;
  content: string;
  learnmoreLink: string;
  bgImg: string;
};

const FeatureCard: React.FC<Props> = ({
  title,
  content,
  learnmoreLink,
  bgImg,
}) => {
  return (
    <div className="relative w-full border border-[#6B7280] rounded-32 px-24 py-32 min-h-560 overflow-hidden">
      <div className="flex items-center justify-end">
        <div className="flex items-center justify-center gap-4 border border-[#FFFFFF0A] rounded-6">
          <a href={learnmoreLink}>Learn more</a>
          <IconQuestionCircle />
        </div>
      </div>
      <h2 className="text-24 font-[800]">{title}</h2>
      <div className="mt-17 text-14 font-500 text-[#FFFFFFA3]">{content}</div>
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
        <img className="w-full" src={bgImg} alt='bg'></img>
      </div>
    </div>
  );
};

export default FeatureCard;
