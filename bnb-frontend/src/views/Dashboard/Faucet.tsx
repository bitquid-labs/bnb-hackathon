import { useConnectModal } from "@rainbow-me/rainbowkit";
import Button from "components/common/Button";
import { BQBTCTokenContract } from "constants/contracts";
import { useAddToken } from "hooks/contracts/useAddToken";
import { ChainType } from "lib/wagmi";
import React, { useState } from "react";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import { parseUnits } from "viem";
import useCallContract from "hooks/contracts/useCallContract";
import ConnectWalletButton from "components/ConnectWalletButton";

const Faucet: React.FC = () => {
  const { address, chain } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { checkAndAddToken } = useAddToken();
  const { callContractFunction } = useCallContract();
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const requestMintBQBTC = async (amount: number) => {
    if (!address) {
      toast.error("Please connect your wallet first!");
      return;
    }
    const params = [address, parseUnits(amount.toString(), 18)];

    try {
      await callContractFunction(
        BQBTCTokenContract.abi,
        BQBTCTokenContract.addresses[(chain as ChainType)?.chainNickName],
        "normalMint",
        params,
        0n,
        () => {
          toast.success("Faucet Sent!");
          setIsLoading(false);
        },
        () => {
          setIsLoading(false);
          toast.success("Failed purchase");
        }
      );

      // await writeContractAsync({
      //   abi: BQBTCTokenContract.abi,
      //   address:
      //     BQBTCTokenContract.addresses[(chain as ChainType)?.chainNickName],
      //   functionName: 'mint',
      //   args: params,
      // });
      // toast.success('Faucet Sent!');
    } catch (err) {
      console.log("error:", err);
      // let errorMsg = '';
      // if (err instanceof Error) {
      //   if (err.message.includes('User denied transaction signature')) {
      //     errorMsg = 'User denied transaction signature';
      //   }
      // }
      // toast.error(errorMsg);
    }
  };

  const handleClaimToken = async () => {
    setIsLoading(true);
    setLoadingMessage("Minting Tokens");
    try {
      // await checkAndAddToken(
      //   BQBTCTokenContract.addresses[
      //     (chain as ChainType)?.chainNickName
      //   ] as `0x${string}`
      // );

      requestMintBQBTC(100);
    } catch (error) {
      console.log("error:", error);
      // let errorMsg = '';
      // if (error instanceof Error) {
      //   if (error.message.includes('User denied transaction signature')) {
      //     errorMsg = 'User denied transaction signature';
      //   }
      // }
      // toast.error(errorMsg);
    }
  };

  return (
    <div className="w-full flex items-start justify-between border border-[#6B7280] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-800 via-zinc-950 to-zinc-950 px-40 py-62 rounded-32 gridd">
      <div className="w-[30%] flex flex-col justify-between items-start">
        <h2 className="text-24 font-[800] text-[#FFFFFF]">BqBtc Testnet Faucet</h2>
        <p className="text-14 text-[#FFFFFFA3] my-25">
          We support BNB testnets. Soon we will onboard other chains as well. Connect your
          wallet, to get Testnet BqBtc and start Testing !
        </p>
        {!address && (
          // <Button
          //   className="w-fit min-w-302 rounded-8 bg-gradient-to-r from-[#00ECBC66] to-[#00ECBC80] py-16 text-center border border-[#00ECBC]"
          //   onClick={openConnectModal}
          // >
          //   {"Connect Wallet"}
          // </Button>
          <ConnectWalletButton className="w-fit min-w-302 rounded-8 bg-gradient-to-r from-[#00ECBC66] to-[#00ECBC80] py-16 text-center border border-[#00ECBC]" />
        )}
        {address && (
          <Button
            isLoading={isLoading}
            size="lg"
            className="text-15 bg-[#F6F6F6] text-[#0A0A0A] rounded-12 "
            onClick={handleClaimToken}
          >
            {isLoading ? loadingMessage : "Claim Token"}
          </Button>
        )}
      </div>
      <div className="w-[40%]">
        <h2 className="text-24 font-[800] text-[#FFFFFF]">How it works?</h2>
        <ul className="text-14 text-[#FFFFFFA3]">
          <li>Step 1: Connect wallet for available Network</li>
          <li>Step 2: Select BqBtc from dropdown</li>
          <li>Step 3: Get BqBtc</li>
          <li>Step 4: To see the tokens add BqBtc address in your wallet</li>
        </ul>
      </div>
    </div>
  );
};

export default Faucet;
