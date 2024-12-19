import { Address } from "viem";

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

export const enum DepositType {
  Vault,
  Pool,
}

export const enum ADT {
  Native,
  ERC20
}

export interface ICover {
  id?: bigint | undefined;
  coverName?: string | undefined;
  riskType?: RiskType | undefined;
  chains?: string | string;
  capacity?: bigint | undefined;
  cost?: bigint | undefined;
  capacityAmount?: bigint | undefined;
  coverValues?: bigint | undefined;
  maxAmount?: bigint | undefined;
  poolId?: bigint | undefined;
  CID?: string | undefined;
  adt: ADT | undefined;
  asset: string | undefined;
  // currentBalance?: bigint | undefined;
  // dailyCost?: bigint | undefined;
  // securityRating?: bigint | undefined;
}

export interface IPool {
  id?: bigint | undefined,
  poolName?: string | undefined,
  rating?: string | undefined,
  riskType?: RiskType | undefined,
  apy?: bigint | undefined,
  minPeriod?: bigint | undefined,
  totalUnit?: bigint | undefined,
  tvl?: bigint | undefined,
  baseValue?: bigint | undefined,
  coverUnits?: bigint | undefined,
  tcp?: bigint | undefined,
  isActive?: boolean | undefined,
  percentageSplitBalance?: bigint | undefined,
  investmentArmPercent?: bigint | undefined,
  leverage?: bigint | undefined,
  asset?: Address | undefined,
  assetType?: ADT | undefined,
}

export interface IVault {
  id?: bigint | undefined,
  vaultName?: string | undefined,
  pools?: IPool[] | [],
  minInv?: bigint | undefined,
  maxInv?: bigint | undefined,
  minPeriod?: bigint | undefined,
  assetType?: ADT | undefined,
  asset?: Address | undefined,
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


export const enum CoverDueTo {
  NoneSelected,
  SmartContract,
  SevereOracle,
}
