import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export const calculateCoverFee = (coverAmount: number, annualRate: number, coverPeriod: number) => {
  console.log(coverAmount, annualRate, coverPeriod)
  return coverAmount * annualRate * coverPeriod / (365 * 100);
}