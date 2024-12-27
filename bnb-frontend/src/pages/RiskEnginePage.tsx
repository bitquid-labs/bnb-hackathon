import React from 'react';
import REMainImg from '../assets/icons/IconREMain.svg';
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";
import { FaXTwitter } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa";

const RiskEngine: React.FC = () => {
  return (
    <div className="bg-black min-h-screen text-white">
      <header className="text-center py-20">
        <h1 className="text-4xl font-semibold pb-5">
          Welcome to <span className="text-[#00ecbc]">Risk Engine</span>
        </h1>
        <p className="text-gray-400 mt-6 max-w-2xl mx-auto mb-16">
          Analyze the risks of covers, strategies, and pools with curated protocols, empowering you to choose between high, moderate, and low-risk investments confidently!
        </p>
        <button className="mt-8 text-sm font-semibold px-48 py-10 border-2 border-white bg-transparent text-white rounded-lg shadow-lg hover:text-[#00ecbc] hover:border-[#00ecbc] transition-all duration-300 ease-in-out">
          Analyse Risks
        </button>
      </header>

      <div className="flex justify-center py-12">
        <img
          src={REMainImg} 
          alt="Risk Engine Diagram"
          className="w-3/4 max-w-xl"
        />
      </div>
      
       <div className="my-32 w-[85%] mx-auto bg-gradient bg-gradient-to-r from-[#FFFFFF] to-[#161618] h-2"></div>
       <div className='flex justify-start items-center'>
        <h2 className="text-2xl font-semibold pl-[8rem] pr-20">How it works</h2><div className="my-32 w-[25%] bg-gradient bg-gradient-to-r from-[#FFFFFF] to-[#161618] h-1"></div></div>
        <div className='min-h-[15rem]'></div>
        <div className="my-32 w-[85%] mx-auto bg-gradient bg-gradient-to-r from-[#FFFFFF] to-[#161618] h-2"></div>


      <footer className="py-16">
        <div className="flex flex-col space-y-12 items-center">
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

export default RiskEngine;
