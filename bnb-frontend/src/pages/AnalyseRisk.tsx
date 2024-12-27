import React, { useState } from "react";
import lowImg from "../assets/icons/lines-re.svg";
import moderateImg from "../assets/icons/lines-y.svg";
import highImg from "../assets/icons/lines-red.svg";
import tick from "../assets/icons/tick-re.svg";
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";
import { FaXTwitter } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa";

const AnalyseRisk: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"de-pegging" | "slashing">("de-pegging");

    const protocols = [
        { name: "Protocol A", risk: "Low" },
        { name: "Protocol A", risk: "Moderate" },
        { name: "Protocol A", risk: "Low" },
        { name: "Protocol A", risk: "Moderate" },
        { name: "Protocol A", risk: "High" },
        { name: "Protocol A", risk: "Low" },
        { name: "Protocol A", risk: "Moderate" },
        { name: "Protocol A", risk: "Low" },
        { name: "Protocol A", risk: "High" },
        { name: "Protocol A", risk: "Moderate" },
        { name: "Protocol A", risk: "Low" },
        { name: "Protocol A", risk: "Low" },
    ];

    const options = ["De-pegging", "Slashing"];

    return (
        <div className="min-h-screen bg-black text-white flex flex-col w-[80%] mx-auto">
            <div className="flex justify-start p-4">
                <div className="flex w-[18rem] h-40 max-w-sm cursor-pointer items-center rounded border border-white/10 bg-white/5 p-[3px] my-20 scale-125" >
                    <div className="relative flex w-full cursor-pointer flex-col items-center rounded md:flex-row md:gap-0">
                        {options.map((option, index) => (
                            <div
                                key={index}
                                className={`z-10 w-full py-6 text-center text-sm font-medium capitalize transition-all ${activeTab === option.toLowerCase().replace(" ", "-")
                                    ? "text-white"
                                    : "text-white/50"
                                    }`}
                                onClick={() =>
                                    setActiveTab(option.toLowerCase().replace(" ", "-") as "de-pegging" | "slashing")
                                }
                            >
                                <div
                                    className={`flex justify-center border-r ${activeTab === option.toLowerCase().replace(" ", "-")
                                        ? "border-white/10"
                                        : "border-transparent"
                                        }`}
                                >
                                    {option}
                                </div>
                            </div>
                        ))}
                        <div
                            className="absolute inset-y-0 hidden rounded bg-white/15 transition-all md:block"
                            style={{
                                width: `${100 / options.length}%`,
                                transform: `translateX(${(activeTab === "de-pegging" ? 0 : 1) * 100
                                    }%)`,
                            }}
                        />
                        <div
                            className="absolute inset-x-0 rounded bg-white/15 transition-all md:hidden"
                            style={{
                                height: `${100 / options.length}%`,
                                transform: `translateY(${(activeTab === "de-pegging" ? 0 : 1) * 100
                                    }%)`,
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="flex-1 flex p-6 gap-28">
                <div className="flex-1 grid grid-cols-4 gap-16">
                    {protocols.map((protocol, index) => {
                        const riskColors = {
                            Low: "s-low",
                            Moderate: "s-moderate",
                            High: "s-high",
                        };

                        const riskColorClass = riskColors[protocol.risk as keyof typeof riskColors] || "bg-gray-500";

                        const riskImages: { [key: string]: string } = {
                            Low: lowImg,
                            Moderate: moderateImg,
                            High: highImg,
                        };

                        const imgSrc = riskImages[protocol.risk] || "";

                        const riskTextColors: { [key: string]: string } = {
                            Low: "text-emerald-500",
                            Moderate: "text-yellow-600",
                            High: "text-red-600",
                        };

                        const riskTextColorClass = riskTextColors[protocol.risk] || "text-white";

                        return (
                            <div
                                key={index}
                                className={`flex flex-col items-center justify-center p-6 ${riskColorClass} aspect-square rounded-full gap-4 m-3`}
                            >
                                <div>
                                    <img src={imgSrc} alt={protocol.risk} />
                                </div>
                                <div className="text-lg font-semibold mt-4">{protocol.name}</div>
                                <div className={`text-sm ${riskTextColorClass}`}>{protocol.risk}</div>
                            </div>
                        );
                    })}
                </div>

                <div className="w-[16rem] p-10 glass-2 shadow-md flex flex-col items-center">
                    <div className="pt-16"><img src={tick} alt="" /></div>
                    <h2 className="text-xl font-bold mt-20 mb-4">Cover Premium</h2>
                    <div className="text-xl mb-32">--</div>
                    <div className="h-[12rem] w-[12rem] glass-3 my-16 flex flex-row justify-center items-start py-12 px-8">
                        <h3 className="text-lg font-medium">Risk Score:</h3>
                    </div>
                    <button className="px-[30px] s-low py-3 rounded-lg ">
                        Purchase Cover →
                    </button>
                </div>
            </div>

            <div className="my-32 w-full bg-gradient bg-gradient-to-r from-[#FFFFFF] to-[#161618] h-2 mt-[8rem] mb-[5rem]"></div>

            <footer className="py-16 mb-[4rem]">
                    <div className="flex flex-col space-y-12 items-center scale-110">
                      <a
                        href="https://example.com/docs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass w-[60rem] py-8 px-24"
                      >
                        <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-12 justify-center'>
                        <HiOutlineClipboardDocumentCheck />
                        <span>Explore BQ Labs Docs.</span>
                        </div>
                        <span className="text-white text-2xl transform rotate-[320deg]">&rarr;</span>
                        </div>
                      </a>
                      <a
                        href="https://example.com/news"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass w-[60rem] py-8 px-24"
                      >
                        <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-12 justify-center'>
                        <FaXTwitter />
                        <span>Stay updated with our latest news and join the conversation.</span>
                        </div>
                        <span className="text-white text-2xl transform rotate-[320deg]">&rarr;</span>
                        </div>
                      </a>
                      <a
                        href="https://example.com/community"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass w-[60rem] py-8 px-24"
                      >
                        <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-12 justify-center'>
                        <FaDiscord />
                        <span>Join our community.</span>
                        </div>
                        <span className="text-white text-2xl transform rotate-[320deg]">&rarr;</span>
                        </div>
                      </a>
                    </div>
                  </footer>
        </div>
    );
};

export default AnalyseRisk;

