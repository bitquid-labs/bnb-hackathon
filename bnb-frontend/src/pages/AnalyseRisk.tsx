import React, { useState, useEffect } from "react";
import lowImg from "../assets/icons/lines-re.svg";
import moderateImg from "../assets/icons/lines-y.svg";
import highImg from "../assets/icons/lines-red.svg";
import tick from "../assets/icons/tick-re.svg";
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { MoonLoader } from "react-spinners";
import { FaXTwitter } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa";
import { toast } from 'react-toastify';

type CoinData = {
    [key: string]: {
        premium: string;
        riskScore: string;
    };
};

const coinIdMapping = {
    "Babylon Validator": 1,
    InfStones: 2,
    DAIC: 3,
    "Core Validator": 1115,
    Stakecito: 4,
    Pier2: 5,
    BIMA: 6,
    Satoshi: 7,
    LstBTC: 8,
    BounceBit_BTC: 9,
    FDUSD: 10,
    Lorenzo: 83291,
    LBTC: 11,
    TUSD: 12,
    USDe: 13,
    Bedrock: 14,
};

const coinData: CoinData = {
    Satoshi: { premium: "10%", riskScore: "0.57" },
    BIMA: { premium: "11%", riskScore: "0.64" },
    Lorenzo: { premium: "5%", riskScore: "0.19" },
    Bedrock: { premium: "16%", riskScore: "0.72" },
    FDUSD: { premium: "8%", riskScore: "0.38" },
    LstBTC: { premium: "5%", riskScore: "0.21" },
    LBTC: { premium: "4%", riskScore: "0.15" },
    BounceBit_BTC: { premium: "6%", riskScore: "0.26" },
    USDe: { premium: "14%", riskScore: "0.69" },
    TUSD: { premium: "20%", riskScore: "0.97" },
};

const protocolData: CoinData = {
    "InfStones": { premium: "11%", riskScore: "0.49" },
    "DAIC": { premium: "18%", riskScore: "0.82" },
    "Stakecito": { premium: "5%", riskScore: "0.11" },
    "Pier2": { premium: "6%", riskScore: "0.15" },
    "Babylon Validator": { premium: "8%", riskScore: "0.22" },
    "Core Validator": { premium: "10%", riskScore: "0.40" },
};

const DepeggingProtocols = ({ onSelect }: { onSelect: (name: string) => void }) => {
    const stableCoins = [
        { name: "Satoshi", risk: "Moderate" },
        { name: "BIMA", risk: "Moderate" },
        { name: "Lorenzo", risk: "Low" },
        { name: "Bedrock", risk: "High" },
        { name: "FDUSD", risk: "Low" },
        { name: "LstBTC", risk: "Low" },
        { name: "LBTC", risk: "Low" },
        { name: "BounceBit_BTC", risk: "Low" },
        { name: "USDe", risk: "High" },
        { name: "TUSD", risk: "High" },
    ];

    return (
        <div className="flex-1 grid grid-cols-4 gap-16">
            {stableCoins.map((stableCoin, index) => {
                const riskColors: { [key: string]: string } = {
                    Low: "s-low",
                    Moderate: "s-moderate",
                    High: "s-high",
                };

                const riskColorClass = riskColors[stableCoin.risk] || "bg-gray-500";

                const riskImages = {
                    Low: lowImg,
                    Moderate: moderateImg,
                    High: highImg,
                };

                const imgSrc = riskImages[stableCoin.risk as keyof typeof riskImages] || "";

                const riskTextColors = {
                    Low: "text-emerald-500",
                    Moderate: "text-yellow-600",
                    High: "text-red-600",
                };

                const riskTextColorClass = riskTextColors[stableCoin.risk as keyof typeof riskTextColors] || "text-white";

                return (
                    <div
                        key={index}
                        className={`flex flex-col items-center justify-center p-6 ${riskColorClass} aspect-square rounded-full gap-4 m-3`}
                        onClick={() => onSelect(stableCoin.name)}
                    >
                        <div>
                            <img src={imgSrc} alt={stableCoin.risk} />
                        </div>
                        <div className="text-lg font-semibold mt-4">{stableCoin.name}</div>
                        <div className={`text-sm ${riskTextColorClass}`}>{stableCoin.risk}</div>
                    </div>
                );
            })}
        </div>
    );
};

const SlashingProtocols = ({ onSelect }: { onSelect: (name: string) => void }) => {
    const protocols = [
        { name: "InfStones", risk: "Moderate" },
        { name: "DAIC", risk: "High" },
        { name: "Stakecito", risk: "Low" },
        { name: "Pier2", risk: "Low" },
        { name: "Babylon Validator", risk: "Low" },
        { name: "Core Validator", risk: "Moderate" },
    ];

    return (
        <div className="flex-1 grid grid-cols-4 gap-16">
            {protocols.map((protocol, index) => {
                const riskColors = {
                    Low: "s-low",
                    Moderate: "s-moderate",
                    High: "s-high",
                };

                const riskColorClass = riskColors[protocol.risk as keyof typeof riskColors] || "bg-gray-500";

                const riskImages = {
                    Low: lowImg,
                    Moderate: moderateImg,
                    High: highImg,
                };

                const imgSrc = riskImages[protocol.risk as keyof typeof riskImages] || "";

                const riskTextColors = {
                    Low: "text-emerald-500",
                    Moderate: "text-yellow-600",
                    High: "text-red-600",
                };

                const riskTextColorClass = riskTextColors[protocol.risk as keyof typeof riskTextColors] || "text-white";

                return (
                    <div
                        key={index}
                        className={`flex flex-col items-center justify-center p-6 ${riskColorClass} aspect-square rounded-full gap-4 m-3`}
                        onClick={() => onSelect(protocol.name)}
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
    );
};

const AnalyseRisk = () => {
    const [activeTab, setActiveTab] = useState("de-pegging");
    const [selectedCoin, setSelectedCoin] = useState<{ premium: string; riskScore: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSelectCoin = (name: string) => {
        setLoading(true);
        const data = activeTab === "de-pegging" ? coinData : protocolData;
        setSelectedCoin(data[name as keyof typeof data] || null);
    };

    useEffect(() => {
        if (selectedCoin) {
            const timer = setTimeout(() => {
                setLoading(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [selectedCoin]);

    const options = ["De-pegging", "Slashing"];

    const navigate = useNavigate();

    const handlePurchaseClick = () => {
        const selectedName = activeTab === "de-pegging"
            ? Object.keys(coinData).find(coin => coinData[coin] === selectedCoin)
            : Object.keys(protocolData).find(protocol => protocolData[protocol] === selectedCoin);
        if (!selectedName) {
            toast.error("Please select any coin or protocol.");
            return null;
        }

        console.log(`Selected ${activeTab === "de-pegging" ? "coin" : "protocol"}: ${selectedName}`);

        if (selectedName && coinIdMapping[selectedName as keyof typeof coinIdMapping]) {
            const id = coinIdMapping[selectedName as keyof typeof coinIdMapping];
            console.log(`Redirecting to /coverdetail/${id}`);
            navigate(`/coverdetail/${id}`);
        } else {
            console.log("No matching ID found for the selected name.");
        }
    };


    return (
        <div className="min-h-screen bg-black text-white flex flex-col w-[80%] mx-auto">
            <div className="flex justify-start p-4">
                <div className="flex w-[18rem] h-40 max-w-sm cursor-pointer items-center rounded border border-white/10 bg-white/5 p-[3px] my-20 scale-125">
                    <div className="relative flex w-full cursor-pointer flex-col items-center rounded md:flex-row md:gap-0">
                        {options.map((option, index) => (
                            <div
                                key={index}
                                className={`z-10 w-full py-6 text-center text-sm font-medium capitalize transition-all ${activeTab === option.toLowerCase().replace(" ", "-")
                                    ? "text-white"
                                    : "text-white/50"
                                    }`}
                                onClick={() => setActiveTab(option.toLowerCase().replace(" ", "-"))}
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
                {activeTab === "de-pegging" && <DepeggingProtocols onSelect={handleSelectCoin} />}
                {activeTab === "slashing" && <SlashingProtocols onSelect={handleSelectCoin} />}

                <div className="w-[16rem] p-10 glass-2 shadow-md flex flex-col items-center">
                    <div className="pt-16">
                        <img src={tick} alt="" />
                    </div>
                    <h2 className="text-xl font-bold mt-20 mb-4">Cover Premium</h2>
                    <div className="text-3xl mb-32 text-emerald-500 font-bold">
                        {loading ? "--" : selectedCoin?.premium || "--"}
                    </div>
                    <div className="h-[12rem] w-[12rem] glass-3 my-8 flex flex-row justify-center items-start py-12 px-8">
                        <div className="text-lg font-medium flex flex-col justify-center items-center">
                            <div className="mb-32">Risk Score:</div> <div className="text-6xl font-bold text-emerald-600">{loading ? <MoonLoader color={"#05EBBC"} size={40} /> : selectedCoin?.riskScore || ""}</div>
                        </div>
                    </div>
                    <button onClick={handlePurchaseClick} className="px-[30px] s-low py-3 rounded-lg mt-20">
                        Purchase Cover →
                    </button>
                </div>
            </div>

            <div className="my-32 w-full bg-gradient bg-gradient-to-r from-[#FFFFFF] to-[#161618] h-2 mt-[8rem] mb-[5rem]"></div>

            <footer className="py-16 mb-[4rem]">
                <div className="flex flex-col space-y-12 items-center scale-110">
                    <a
                        href="https://docs.bqlabs.xyz/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass w-[60rem] py-8 px-24"
                    >
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-12 justify-center">
                                <HiOutlineClipboardDocumentCheck />
                                <span>Explore BQ Labs Docs.</span>
                            </div>
                            <span className="text-white text-2xl transform rotate-[320deg]">&rarr;</span>
                        </div>
                    </a>
                    <a
                        href="https://twitter.com/BQ_Labs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass w-[60rem] py-8 px-24"
                    >
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-12 justify-center">
                                <FaXTwitter />
                                <span>
                                    Stay updated with our latest news and join the
                                    conversation.
                                </span>
                            </div>
                            <span className="text-white text-2xl transform rotate-[320deg]">&rarr;</span>
                        </div>
                    </a>
                    <a
                        href="https://discord.gg/GzC7DZDN"
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
