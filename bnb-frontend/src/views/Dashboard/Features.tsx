import React from "react";
import FeatureCard from "./FeatureCard";
import featureBG1 from "assets/images/feature-bg-1.svg"
import featureBG2 from "assets/images/feature-bg-2.svg"
import featureBG3 from "assets/images/feature-bg-3.svg"
import SectionTitle from "components/common/SectionTitle";

const featuresList = [
  {
    title: "Covers",
    content: "Secure your assets effortlessly explore, select, and purchase covers seamlessly.",
    bgImg: featureBG1,
    learnmoreLink: "#",
  },
  {
    title: "Deposits",
    content: "Secure your assets effortlessly explore, select, and purchase covers seamlessly.",
    bgImg: featureBG2,
    learnmoreLink: "#",
  },
  {
    title: "Check Assets",
    content: "Secure your assets effortlessly explore, select, and purchase covers seamlessly. ",
    bgImg: featureBG3,
    learnmoreLink: "#",
  },
];

const Features: React.FC = () => {
  return (
    <div className="w-full">
      <SectionTitle title="Testnet Features" />
      <div className="w-full grid grid-cols-3 gap-32 mt-45">
      {featuresList.map((feature, index) => (
        <FeatureCard
          key={index}
          title={feature.title}
          content={feature.content}
          bgImg={feature.bgImg}
          learnmoreLink={feature.learnmoreLink}
        />
      ))}
      </div>
    </div>
  );
};

export default Features;
