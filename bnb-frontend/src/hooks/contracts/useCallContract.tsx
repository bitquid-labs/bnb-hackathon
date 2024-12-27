import { useWriteContract } from "wagmi";
import config from "lib/config";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as React from "react";
import { useTransactionConfirmations } from "wagmi";
import { getTransactionConfirmations } from '@wagmi/core'

const useCallContract = () => {
  const { status, data, error, writeContractAsync } = useWriteContract({ config });
  const [waitingConfirmDo, setWaitingConfirmDo] = useState<() => void>();
  const [onErrorDo, setOnErrorDo] = useState<() => void>();
  const [txHash, setTxHash] = useState("");

  const { status: txStatus } = useTransactionConfirmations({
    hash: txHash as `0x${string}`,
  });

  console.log('error:', error)

  useEffect(() => {
    if (status === "error") {
      if (onErrorDo) {
        onErrorDo();
      }
    }
  }, [status]);

  const callContractFunction = async (
    abi: any,
    address: string,
    func: string,
    args: any[],
    value: bigint,
    waitingForConfirm: () => void,
    onErrorDo?: () => void
  ) => {
    const contractAddress = address as `0x${string}`;
    setWaitingConfirmDo(() => waitingForConfirm);
    setOnErrorDo(() => onErrorDo);

    const res = await writeContractAsync({
      abi,
      address: contractAddress,
      functionName: func,
      args,
      value,
    });

    const intervalId = setInterval(async () => {
      const blocks = await getTransactionConfirmations(config, {
        hash: res,
      })

      if (blocks > 0) {
        waitingForConfirm();
        clearInterval(intervalId);
      }
    }, 1000)

    setTxHash(res);
    return res;
  };

  return { callContractFunction };
};

export default useCallContract;
