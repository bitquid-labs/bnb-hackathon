import React from "react";
import { RiskType } from "types/common";
import IconSearch from "assets/icons/IconSearch";
import Input from "components/common/Input";
import { filters } from "./constants";
import { cn } from "lib/utils";

type SearchType = {
  filterCategory: RiskType | undefined;
  setFilterCategory: (value: RiskType | undefined) => void;
};

const Search: React.FC<SearchType> = ({
  filterCategory,
  setFilterCategory,
}) => {
  return (
    <div className="flex w-full flex-col gap-24">
      <div className="flex w-full cursor-pointer items-center rounded border border-white/10 bg-white/5 p-[3px]">
        <div className="relative flex w-full cursor-pointer flex-col items-center rounded md:flex-row md:gap-0">
          {filters.map((opt, index) => (
            <div
              key={index}
              className={cn(
                "z-10 w-full py-12 text-center text-sm font-medium capitalize transition-all",
                filterCategory === opt.index ? "text-white" : "text-white/50 "
              )}
              onClick={() => setFilterCategory(opt.index)}
            >
              <div
                className={cn(
                  "flex justify-center border-r",
                  filterCategory === opt.index
                    ? "border-white/10 "
                    : "border-transparent"
                )}
              >
                {opt.riskType}
              </div>
            </div>
          ))}
          <div
            className={cn(
              "absolute inset-y-0 hidden rounded bg-white/15 transition-all md:block"
            )}
            style={{
              width: `${100 / filters.length}%`,
              transform: `translateX(${
                (filterCategory === undefined ? 0 : filterCategory + 1) * 100
              }%)`,
            }}
          />
          <div
            className={cn(
              "absolute inset-x-0 rounded bg-white/15 transition-all md:hidden"
            )}
            style={{
              height: `${100 / filters.length}%`,
              transform: `translateY(${
                (filterCategory === undefined ? 0 : filterCategory + 1) * 100
              }%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
