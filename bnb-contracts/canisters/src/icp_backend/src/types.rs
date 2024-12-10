use std::collections::HashMap;

use candid::{CandidType, Deserialize, Nat, Principal};
use serde::Serialize;

#[derive(Clone, CandidType, Deserialize)]
pub struct Cover {
    pub id: Nat,
    pub cover_name: String,
    pub risk_type: RiskType,
    pub chains: String,
    pub capacity: Nat,
    pub cost: Nat,
    pub capacity_amount: Nat,
    pub cover_values: Nat,
    pub max_amount: Nat,
    pub pool_id: Nat,
    pub cid: String,
}

#[derive(Clone, CandidType, Deserialize)]
pub struct GenericCoverInfo {
    pub user: Principal,
    pub cover_id: Nat,
    pub risk_type: RiskType,
    pub cover_name: String,
    pub cover_value: Nat,
    pub claim_paid: Nat,
    pub cover_period: Nat,
    pub end_day: Nat,
    pub is_active: bool,
}

#[derive(Clone, CandidType, Deserialize, PartialEq)]
pub struct Proposal {
    pub id: Nat,
    pub votes_for: Nat,
    pub votes_against: Nat,
    pub created_at: Nat,
    pub deadline: Nat,
    pub timeleft: Nat,
    pub status: ProposalStatus,
    pub executed: bool,
    pub proposal_param: ProposalParam,
    pub voters_for: Vec<Principal>,
    pub voters_against: Vec<Principal>,
}

#[derive(Clone, CandidType, Deserialize, PartialEq)]
pub struct ProposalParam {
    pub user: Principal,
    pub risk_type: RiskType,
    pub cover_id: Nat,
    pub tx_hash: String,
    pub description: String,
    pub pool_id: Nat,
    pub claim_amount: Nat,
}

#[derive(Clone, CandidType, Deserialize, PartialEq)]
pub enum RiskType {
    Slashing,
    SmartContract,
    Stablecoin,
    Protocol,
}

#[derive(Clone, CandidType, Deserialize, PartialEq)]
pub enum ProposalStatus {
    Submitted,
    Pending,
    Approved,
    Claimed,
    Rejected,
}

#[derive(Clone, CandidType, Deserialize)]
pub struct Voter {
    pub voted: bool,
    pub vote: bool,
    pub weight: Nat,
}

#[derive(Clone, CandidType, Deserialize)]
pub struct Pool {
    pub pool_name: String,
    pub risk_type: RiskType,
    pub apy: Nat,
    pub min_period: Nat,
    pub tvl: Nat,
    pub tcp: Nat,
    pub is_active: bool,
    pub percentage_split_balance: Nat,
    pub deposits: HashMap<Principal, Deposit>,
}

#[derive(Clone, CandidType, Deserialize)]
pub struct Deposit {
    pub lp: Principal,
    pub amount: Nat,
    pub pool_id: Nat,
    pub daily_payout: Nat,
    pub status: Status,
    pub days_left: Nat,
    pub start_date: Nat,
    pub expiry_date: Nat,
    pub accrued_payout: Nat,
}

#[derive(Clone, CandidType, Deserialize, PartialEq)]
pub enum Status {
    Active,
    Withdrawn,
}

#[derive(Clone, CandidType, Deserialize)]
pub struct PoolInfo {
    pub pool_name: String,
    pub pool_id: Nat,
    pub daily_payout: Nat,
    pub deposit_amount: Nat,
    pub apy: Nat,
    pub min_period: Nat,
    pub tvl: Nat,
    pub tcp: Nat,
    pub is_active: bool,
    pub accrued_payout: Nat,
}

#[derive(Clone, CandidType, Deserialize)]
pub struct Networks {
    pub name: String,
    pub rpc_url: String,
    pub supported_assets: Vec<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct JsonRpcRequest {
    pub id: u64,
    pub jsonrpc: String,
    pub method: String,
    pub params: (EthCallParams, String),
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct EthCallParams {
    pub to: String,
    pub data: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct JsonRpcResult {
    pub result: Option<String>,
    pub error: Option<JsonRpcError>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct JsonRpcError {
    pub code: isize,
    pub message: String,
}
