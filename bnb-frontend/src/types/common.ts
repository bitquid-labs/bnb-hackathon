export interface IIcon {
  className?: string;
  fill?: string;
}

export const enum RiskType {
  Slashing,
  SmartContract,
  Stablecoin,
  Protocol,
}

export interface ICover {
  id?: bigint | undefined;
  riskType?: RiskType | undefined;
  capacity?: bigint | undefined;
  capacityAmount?: bigint | undefined;
  chains?: string | string;
  CID?: string | undefined;
  cost?: bigint | undefined;
  coverName?: string | undefined;
  coverValues?: bigint | undefined;
  currentBalance?: bigint | undefined;
  dailyCost?: bigint | undefined;
  maxAmount?: bigint | undefined;
  poolId?: bigint | undefined;
  securityRating?: bigint | undefined;
}

export interface IUserCover {
  chainId?: bigint | undefined;
  claimPaid?: bigint | undefined;
  // coverFee?: bigint | undefined,
  coverId?: bigint | undefined;
  coverName?: string | undefined;
  coverPeriod?: bigint | undefined;
  coverValue?: bigint | undefined;
  endDay?: bigint | undefined;
  isActive?: boolean | undefined;
  startDay?: bigint | undefined;
  user?: string | undefined;
  riskType?: number | undefined;
}

export const riskTypeNames = [
  'Slashing Vulnerability',
  'SmartContract Vulnerability',
  'Stablecoin Vulnerability',
  'Protocol Vulnerability',
];