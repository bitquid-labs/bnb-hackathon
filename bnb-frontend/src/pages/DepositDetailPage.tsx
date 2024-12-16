import { cn } from "lib/utils";
import React, { useState } from "react";

const DepositDetailPage: React.FC = () => {
  const types = [
    {
      index: 0,
      depositType: "Strategies",
    },
    {
      index: 1,
      depositType: "Pools",
    },
  ];

  const [currentType, setCurrentType] = useState<number>(0);

  return (
    <div className="w-full px-75 mx-auto pt-70">
      <div className="mx-auto w-320">
        <div className="flex w-full cursor-pointer items-center rounded border border-white/10 bg-white/5 p-[3px]">
          <div className="relative flex w-full cursor-pointer flex-col items-center rounded md:flex-row md:gap-0">
            {types.map((opt, index) => (
              <div
                key={index}
                className={cn(
                  "z-10 w-full py-12 text-center text-sm font-medium capitalize transition-all",
                  currentType === opt.index ? "text-white" : "text-white/50 "
                )}
                onClick={() => setCurrentType(opt.index)}
              >
                <div
                  className={cn(
                    "flex justify-center border-r",
                    currentType === opt.index
                      ? "border-white/10 "
                      : "border-transparent"
                  )}
                >
                  {opt.depositType}
                </div>
              </div>
            ))}
            <div
              className={cn(
                "absolute inset-y-0 hidden rounded bg-white/15 transition-all md:block"
              )}
              style={{
                width: `${100 / types.length}%`,
                transform: `translateX(${
                  (currentType === undefined ? 0 : currentType) * 100
                }%)`,
              }}
            />
            <div
              className={cn(
                "absolute inset-x-0 rounded bg-white/15 transition-all md:hidden"
              )}
              style={{
                height: `${100 / types.length}%`,
                transform: `translateY(${
                  (currentType === undefined ? 0 : currentType) * 100
                }%)`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositDetailPage;
