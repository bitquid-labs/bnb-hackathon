import { riskTypeNames } from "types/common";
import { formatUnits, parseUnits } from "viem";

export function bnToNumber(value: bigint | undefined, decimals: number = 18) {
  if (!value) return 0;
  return parseFloat(formatUnits(value, decimals));
}

export function getRiskTypeName(value: number | undefined): string | undefined {
  if (value === undefined) return '';
  return riskTypeNames[value] as string | undefined;
}