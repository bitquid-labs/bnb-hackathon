import React, { useEffect, useState } from 'react';
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";
import { FaXTwitter } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import lottie from 'lottie-web';

const RiskEngine: React.FC = () => {
    const [isAnimating, setIsAnimating] = useState(false);
    const navigate = useNavigate();

    const dePeggingRisk = [
        { title: 'Volatility of Stablecoin', description: 'Tracks price fluctuations to assess stability.' },
        { title: 'Price Deviation', description: 'Monitors how far the price deviates from the peg.' },
        { title: 'Persistence of Price Deviation', description: 'Measures how long the price stays off-peg.' },
        { title: 'Liquidity on DEX', description: 'Evaluates available liquidity on decentralized exchanges.' },
        { title: 'Number of Active Addresses', description: 'Analyzes wallet activity to gauge network health.' },
        { title: 'Transaction Volume', description: 'Reviews transaction flow for signs of instability.' },
    ];

    const slashingRisk = [
        { title: 'Block Completion Rate', description: 'Tracks the rate of successfully completed blocks.' },
        { title: 'Stake Size', description: 'Considers the amount of stake to assess security risks.' },
        { title: 'Uptime Percentage', description: 'Measures validator availability and reliability.' },
        { title: 'Network Latency', description: 'Monitors delays in network communication.' },
    ];

    useEffect(() => {
        const container = document.getElementById('animation-container');
        if (container) {
            try {
                const animation = lottie.loadAnimation({
                    container: container,
                    renderer: 'svg',
                    loop: false,
                    autoplay: false,
                    animationData: require('../assets/riskengine.json'),
                });

                return () => animation.destroy();
            } catch (error) {
                console.error('Error loading Lottie animation:', error);
            }
        }
    }, []);

    const handleAnalyseRiskClick = () => {
        setIsAnimating(true);
        const container = document.getElementById('animation-container');
        if (container) {
            lottie.play();
        }
        setTimeout(() => {
            navigate('/riskengine/analyserisks');
        }, 3000);
    };

    return (
        <div className={`bg-black min-h-screen text-white`}>
            <header className="text-center py-20 mt-20">
                <h1 className="text-6xl font-semibold pb-5">
                    Welcome to <span className="text-[#00ecbc]">Risk Engine</span>
                </h1>
                <p className="text-gray-400 mt-20 max-w-2xl mx-auto mb-28 text-m">
                    Analyze the risks of covers, strategies, and pools with curated protocols, empowering you to choose between high, moderate, and low-risk investments confidently!
                </p>
                <button
                    className="mt-8 mb-5 text-sm font-semibold px-48 py-10 border-2 border-white bg-transparent text-white rounded-lg shadow-lg hover:text-[#00ecbc] hover:border-[#00ecbc] transition-all duration-300 ease-in-out"
                    onClick={handleAnalyseRiskClick}
                >
                    Analyse Risks
                </button>
            </header>

            <div
                className="flex justify-center py-12 transition-all duration-300"
            >
                <div id="animation-container" style={{ width: '40rem', maxWidth: '100%' }}></div>
            </div>

            {!isAnimating && (
                <>
                    <div className="my-40 w-[85%] mx-auto bg-gradient bg-gradient-to-r from-[#FFFFFF] to-[#161618] h-2"></div>
                    <div className='flex justify-start items-center'>
                        <h2 className="text-2xl font-semibold pl-[8rem] pr-20">Parameters used</h2>
                        <div className="my-32 w-[25%] bg-gradient bg-gradient-to-r from-[#FFFFFF] to-[#161618] h-1"></div>
                    </div>

                    <div className="bg-black text-white py-10 px-6 sm:px-12 w-[75%] mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* De-pegging Risk */}
                            <div>
                                <h2 className="text-xl font-bold mb-6">De-pegging Risk:</h2>
                                <ul className="space-y-4">
                                    {dePeggingRisk.map((item, index) => (
                                        <li key={index} className="flex items-start space-x-3 space-y-6">
                                            <span className="text-green-400 mt-6 scale-75">◆</span>
                                            <div>
                                                <h3 className="font-medium">{item.title}</h3>
                                                <p className="text-gray-300 text-sm">{item.description}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Slashing Risk */}
                            <div>
                                <h2 className="text-xl font-bold mb-6">Slashing Risk:</h2>
                                <ul className="space-y-4">
                                    {slashingRisk.map((item, index) => (
                                        <li key={index} className="flex items-start space-x-3 space-y-6">
                                            <span className="text-green-400 mt-6 scale-75">◆</span>
                                            <div>
                                                <h3 className="font-medium">{item.title}</h3>
                                                <p className="text-gray-300 text-sm">{item.description}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="my-32 w-[85%] mx-auto bg-gradient bg-gradient-to-r from-[#FFFFFF] to-[#161618] h-2"></div>

                    <footer className="py-16 scale-110">
                        <div className="flex flex-col space-y-12 items-center">
                            <a
                                href="https://docs.bqlabs.xyz/"
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
                                href="https://twitter.com/BQ_Labs"
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
                </>
            )}
        </div>
    );
};

export default RiskEngine;
