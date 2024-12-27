import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { riskTypeNames, poolRiskTypeNames } from 'types/common';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export const calculateCoverFee = (coverAmount: number, annualRate: number, coverPeriod: number) => {
  return coverAmount * annualRate * coverPeriod * 10000 / (365 * 100);
}


export function getRiskTypeName(value: number | undefined): string | undefined {
  if (value === undefined) return '';
  return riskTypeNames[value] as string | undefined;
}


export function getPoolRiskTypeName(value: number | undefined): string | undefined {
  if (value === undefined) return '';
  return poolRiskTypeNames[value] as string | undefined;
}

export const scrollToTop = () => {
  window.scrollTo({
    top: 0, // Scroll to the top
    behavior: "smooth", // Smooth scroll animation
  });
}; 