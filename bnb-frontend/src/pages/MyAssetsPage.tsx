import { cn } from "lib/utils";
import React, { useState, useEffect } from "react";
import InvestedPools from "views/MyAssets/Pools/InvestedPools";
import VaultsOverview from "views/MyAssets/Vaults/VaultsOverview";
import metamask from "../assets/images/metamask.svg";
import btc from "../assets/images/bitcoin.svg";
import { ethers } from "ethers";

const MyAssetsPage = () => {
  const types = ["Pools", "Strategies"];
  const [currentAsset, setCurretAsset] = useState(0);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("");
  interface Pool {
    poolName: string;
    depositAmount: bigint;
  }

  const [pools, setPools] = useState<Pool[]>([]);

  useEffect(() => {
    const getWalletDetails = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          setWalletAddress(address);

          const poolContractAddress = "0xFc226a099aE3068C3A7C7389bcFa0d7FfDa37C0e";
          const poolAbi = [
            "function getPoolsByAddress(address _userAddress) public view returns (tuple(string poolName, uint256 depositAmount)[])"
          ];
          const poolContract = new ethers.Contract(poolContractAddress, poolAbi, provider);

          const userPools = await poolContract.getPoolsByAddress(address);
          setPools(userPools);

          const balanceAbi = [
            "function getUserBalanceinUSD(address user) public view returns(uint256)"
          ];
          const balanceContract = new ethers.Contract(poolContractAddress, balanceAbi, provider);

          const balanceInUSD = await balanceContract.getUserBalanceinUSD(address);
          const formattedBalance = ethers.formatEther(balanceInUSD);
          setWalletBalance(formattedBalance);
        } catch (error) {
          console.error("Error fetching wallet details:", error);
        }
      } else {
        console.log("Please install MetaMask!");
      }
    };

    getWalletDetails();
  }, []);

  return (
    <div className="w-[80%] mx-auto pt-70">
      <div className="flex gap-16 bg-black text-white p-6 mb-44">
        {/* First Card */}
        <div className="glass rounded-2xl shadow-lg p-6 w-[80%] px-40 py-32 space-y-56">
          <div className="flex flex-col gap-48 justify-between items-center mb-6 mt-20">
            <div>
              <p className="text-sm text-gray-400">Your Wallet:</p>
              <div className="flex items-center gap-5 justify-center mt-10">
                <img src={metamask} alt="" />
                <p className="text-xl font-bold">{walletAddress.slice(0, 10)}...{walletAddress.slice(-9)}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400">Wallet Balance:</p>
              <div className="flex items-center gap-5 justify-center mt-10">
                <img src={btc} alt="" />
                <p className="text-xl font-bold text-orange-400">${walletBalance}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Second Card */}
        <div className="glass rounded-2xl shadow-xl p-6 w-[80%] px-40 py-32">
          <p className="text-sm text-gray-400 mb-10">Invested Pools</p>
          <div className="flex flex-col gap-4">
            {pools.map((pool, index) => (
              <div key={index} className="flex justify-between items-center gap-10">
                <p className="font-semibold">{pool.poolName}</p>
                <p className="text-orange-400">${ethers.formatEther(pool.depositAmount)}</p>
              </div>
            ))}
          </div>
          <div>getUserVaultDeposits</div>
        </div>
      </div>
      <div className="mx-auto w-320">
        <div className="flex w-full cursor-pointer items-center rounded border border-white/10 bg-white/5 p-[3px]">
          <div className="relative flex w-full cursor-pointer flex-col items-center rounded md:flex-row md:gap-0">
            {types.map((opt, index) => (
              <div
                key={index}
                className={cn(
                  "z-10 w-full py-12 text-center text-sm font-medium capitalize transition-all",
                  currentAsset === index
                    ? "text-white"
                    : "text-white/50 "
                )}
                onClick={() => setCurretAsset(index)}
              >
                <div
                  className={cn(
                    "flex justify-center border-r",
                    currentAsset === index
                      ? "border-white/10 "
                      : "border-transparent"
                  )}
                >
                  {opt}
                </div>
              </div>
            ))}
            <div
              className={cn(
                "absolute inset-y-0 hidden rounded bg-white/15 transition-all md:block"
              )}
              style={{
                width: `${100 / types.length}%`,
                transform: `translateX(${(currentAsset === undefined ? 0 : currentAsset) *
                  100
                  }%)`,
              }}
            />
            <div
              className={cn(
                "absolute inset-x-0 rounded bg-white/15 transition-all md:hidden"
              )}
              style={{
                height: `${100 / types.length}%`,
                transform: `translateY(${(currentAsset === undefined ? 0 : currentAsset) *
                  100
                  }%)`,
              }}
            />
          </div>
        </div>
      </div>
      <div className="mt-65">
        {
          currentAsset === 0 ? <InvestedPools /> : <VaultsOverview />
        }
      </div>
    </div>
  );
};

export default MyAssetsPage;
