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

export const enum PoolRiskType {
  Low,
  Medium,
  High,
}

export const enum DepositType {
  Normal,
  Vault,
}

export const enum ADT {
  Native,
  ERC20,
}

export const enum Status {
  Active,
  Due,
  Withdrawn,
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

export interface IPoolInfo {
  poolName?: string | undefined;
  rating?: string | undefined;
  risk?: PoolRiskType | undefined;
  poolId?: bigint | undefined;
  dailyPayout?: bigint | undefined;
  depositAmount?: bigint | undefined;
  apy?: bigint | undefined;
  minPeriod?: bigint | undefined;
  totalUnit?: bigint | undefined;
  tcp?: bigint | undefined;
  isActive?: boolean | undefined;
  accruedPayout?: bigint | undefined;
}

export interface IPool {
  id?: bigint | undefined;
  poolName?: string | undefined;
  rating?: string | undefined;
  riskType?: PoolRiskType | undefined;
  apy?: bigint | undefined;
  minPeriod?: bigint | undefined;
  totalUnit?: bigint | undefined;
  tvl?: bigint | undefined;
  baseValue?: bigint | undefined;
  coverUnits?: bigint | undefined;
  tcp?: bigint | undefined;
  isActive?: boolean | undefined;
  percentageSplitBalance?: bigint | undefined;
  investmentArmPercent?: bigint | undefined;
  leverage?: bigint | undefined;
  asset?: Address | undefined;
  assetType?: ADT | undefined;
}

export interface IVault {
  id?: bigint | undefined;
  vaultName?: string | undefined;
  risk?: PoolRiskType | undefined;
  pools?: IPool[] | [];
  apy?: bigint | undefined;
  minInv?: bigint | undefined;
  maxInv?: bigint | undefined;
  minPeriod?: bigint | undefined;
  assetType?: ADT | undefined;
  asset?: Address | undefined;
}

export interface IUserCover {
  user?: string | undefined;
  coverId?: bigint | undefined;
  riskType?: number | undefined;
  coverName?: string | undefined;
  coverValue?: bigint | undefined;
  claimPaid?: bigint | undefined;
  coverPeriod?: bigint | undefined;
  endDay?: bigint | undefined;
  isActive?: boolean | undefined;
}

export interface IVaultDeposit {
  lp: string | undefined;
  amount: bigint | undefined;
  vaultId: bigint | undefined;
  dailyPayout: bigint | undefined;
  status: Status | undefined;
  daysLeft: bigint | undefined;
  startDate: bigint | undefined;
  expiryDate: bigint | undefined;
  withdrawalInitiated: bigint | undefined;
  accruedPayout: bigint | undefined;
  assetType: ADT | undefined;
  asset: string | undefined;
  vaultApy: bigint | undefined;
}

export const riskTypeNames = [
  "Slashing Vulnerability",
  "SmartContract Vulnerability",
  "Stablecoin Vulnerability",
  "Protocol Vulnerability",
];

export const poolRiskTypeNames = ["Low", "Medium", "High"];

export const enum CoverDueTo {
  NoneSelected,
  SmartContract,
  SevereOracle,
}
