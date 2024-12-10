use alloy::hex;
use alloy::primitives::U256;
use alloy::sol_types::SolCall;
use alloy::transports::http::reqwest::Url;
use alloy::{primitives::Address, sol};
use candid::{CandidType, Deserialize, Nat, Principal};
use ic_cdk::api::call::call;
use ic_cdk::api::management_canister::http_request::{
    http_request, CanisterHttpRequestArgument, HttpHeader, HttpMethod, TransformContext,
};
use ic_cdk_macros::*;
use serde::Serialize;
use std::collections::HashMap;
use std::{cell::RefCell, str::FromStr};
use util::from_hex;

mod types;
mod util;
use types::{
    Cover, Deposit, EthCallParams, JsonRpcRequest, JsonRpcResult, Networks, Pool, PoolInfo,
    Proposal, ProposalStatus, Status,
};

const ZER0: u64 = 0;
const HTTP_CYCLES: u128 = 100_000_000; // Default cycles for HTTP request
const MAX_RESPONSE_BYTES: u64 = 2048; // Default response size limit

sol! {
    #[derive(Debug, Serialize, Deserialize)]
    interface IERC20 {
        function balanceOf(address account) external view returns (uint256);
    }
}

thread_local! {
    static STATE: RefCell<State> = RefCell::default();
}

#[derive(CandidType, Deserialize, Default)]
struct State {
    pools: HashMap<Nat, Pool>,
    pool_count: Nat,
    owner: Option<Principal>,
    bq_btc_address: Option<Principal>,
    cover_address: Option<Principal>,
    gov_address: Option<Principal>,
    participants: Vec<Principal>,
    participation: HashMap<Principal, Nat>,
    pool_covers: HashMap<Nat, Vec<Cover>>,
    pool_contract: String,
    cover_contract: String,
    supported_networks: HashMap<Nat, Networks>, // chain id to the network RPC
}

#[init]
fn init(owner: Principal, bq_btc: Principal) {
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        state.owner = Some(owner);
        state.bq_btc_address = Some(bq_btc);
    });
}

fn next_id() -> u64 {
    thread_local! {
        static NEXT_ID: RefCell<u64> = RefCell::default();
    }
    NEXT_ID.with(|next_id| {
        let mut next_id = next_id.borrow_mut();
        let id = *next_id;
        *next_id = next_id.wrapping_add(1);
        id
    })
}

#[query(name = "getPool")]
fn get_pool(pool_id: Nat) -> Result<Pool, String> {
    STATE.with(|state| {
        let state = state.borrow();
        state
            .pools
            .get(&pool_id)
            .cloned()
            .ok_or("Pool not found".to_string())
    })
}

#[query(name = "getTotalTVL")]
async fn get_total_tvl() -> Result<Nat, String> {
    let networks = STATE.with(|state| {
        let state = state.borrow();
        let networks = state.supported_networks.clone();

        networks
    });

    let mut total_tvl: Nat = Nat::from(0u64);

    for (chain_id, network) in networks {
        let network_balance = get_network_tvl(network.rpc_url, chain_id).await?;

        total_tvl += network_balance;
    }

    Ok(total_tvl)
}

#[query(name = "getNetworkTVL")]
async fn get_network_tvl(new_network_rpc: String, chain_id: Nat) -> Result<Nat, String> {
    let (network, pool_contract_address) = STATE.with(|state| {
        let state = state.borrow();

        let network = match state.supported_networks.get(&chain_id) {
            Some(network) => network,
            None => panic!("Network with chain_id {} not found", chain_id),
        };

        let pool_contract_address = match Address::from_str(&state.pool_contract) {
            Ok(address) => address,
            Err(_) => panic!("Error parsing pool contract address"),
        };

        (network.clone(), pool_contract_address)
    });

    let mut total_tvl: Nat = Nat::from(0u64);

    for asset in &network.supported_assets {
        let balance_call = IERC20::balanceOfCall {
            account: pool_contract_address,
        };

        let call_data = balance_call.abi_encode();

        let json_rpc_payload = serde_json::to_string(&JsonRpcRequest {
            id: next_id(),
            jsonrpc: "2.0".to_string(),
            method: "eth_call".to_string(),
            params: (
                EthCallParams {
                    to: asset.to_string(), // Asset contract address
                    data: format!("0x{}", hex::encode(call_data)),
                },
                "latest".to_string(),
            ),
        })
        .map_err(|e| format!("Failed to serialize JSON-RPC request: {}", e))?;

        let parsed_url =
            Url::parse(&new_network_rpc).map_err(|e| format!("Invalid RPC URL: {}", e))?;

        let host = parsed_url
            .host_str()
            .ok_or("Invalid RPC URL host")?
            .to_string();

        let request_headers = vec![
            HttpHeader {
                name: "Content-Type".to_string(),
                value: "application/json".to_string(),
            },
            HttpHeader {
                name: "Host".to_string(),
                value: host,
            },
        ];

        let request = CanisterHttpRequestArgument {
            url: new_network_rpc.clone(),
            max_response_bytes: Some(MAX_RESPONSE_BYTES),
            method: HttpMethod::POST,
            headers: request_headers,
            body: Some(json_rpc_payload.as_bytes().to_vec()),
            transform: Some(TransformContext::from_name("transform".to_string(), vec![])),
        };

        let (response,) = http_request(request, HTTP_CYCLES)
            .await
            .map_err(|(code, msg)| format!("HTTP request failed: {:?} {:?}", code, msg))?;

        let json: JsonRpcResult = serde_json::from_str(
            std::str::from_utf8(&response.body)
                .map_err(|e| format!("Failed to convert response to UTF-8: {}", e))?,
        )
        .map_err(|e| format!("Failed to parse JSON response: {}", e))?;

        if let Some(err) = json.error {
            return Err(format!("JSON-RPC error code {}: {}", err.code, err.message));
        }

        let balance_result = from_hex(&json.result.ok_or("No result in JSON-RPC response")?)
            .map_err(|e| format!("Failed to decode hex result: {:?}", e))?;

        let balance = U256::from_be_bytes::<32>(
            balance_result
                .try_into()
                .map_err(|_| "Balance bytes conversion failed")?,
        );

        let balance_as_nat = Nat::from(
            balance.try_into().unwrap_or(u128::MAX), // Fallback to max u128 if conversion fails
        );

        total_tvl += balance_as_nat;
    }

    Ok(total_tvl)
}

#[query(name = "getAllPools")]
fn get_all_pools() -> Vec<(Nat, Pool)> {
    STATE.with(|state| {
        let state = state.borrow();
        state
            .pools
            .iter()
            .map(|(k, v)| (k.clone(), v.clone()))
            .collect()
    })
}

#[query(name = "getPoolCovers")]
async fn get_pool_covers(pool_id: Nat) -> Result<Vec<Cover>, String> {
    STATE.with(|state| {
        let state = state.borrow();

        let pool_covers = state
            .pool_covers
            .get(&pool_id)
            .ok_or("Pool not found".to_string())?;

        Ok(pool_covers.clone())
    })
}

#[query(name = "getPoolsByAddress")]
fn get_pools_by_address(user_address: Principal) -> Vec<PoolInfo> {
    STATE.with(|state| {
        let state = state.borrow();
        state
            .pools
            .iter()
            .filter_map(|(pool_id, pool)| {
                pool.deposits.get(&user_address).map(|deposit| PoolInfo {
                    pool_name: pool.pool_name.clone(),
                    pool_id: pool_id.clone(),
                    daily_payout: deposit.daily_payout.clone(),
                    deposit_amount: deposit.amount.clone(),
                    apy: pool.apy.clone(),
                    min_period: pool.min_period.clone(),
                    tvl: pool.tvl.clone(),
                    tcp: pool.tcp.clone(),
                    is_active: pool.is_active,
                    accrued_payout: deposit.accrued_payout.clone(),
                })
            })
            .collect()
    })
}

#[update(name = "withdraw")]
async fn withdraw(pool_id: Nat, amount: Nat) -> Result<(), String> {
    let caller = ic_cdk::caller();

    let (amount_to_mint, bq_btc_address) = STATE.with(|state| {
        let mut state = state.borrow_mut();
        let bq_btc_address = state
            .bq_btc_address
            .ok_or("bqBTC canister address not set".to_string())?;
        let pool = state.pools.get_mut(&pool_id).ok_or("Pool not found")?;

        if !pool.is_active {
            return Err("Pool is inactive".to_string());
        }

        if let Some(caller_deposit) = pool.deposits.get_mut(&caller) {
            let current_time = Nat::from(ic_cdk::api::time() / 1_000_000_000);
            if current_time < caller_deposit.expiry_date {
                return Err("Cant withdraw before the end of a deposit period".to_string());
            }
            if caller_deposit.status == Status::Withdrawn {
                return Err("Caller has already withdrawn".to_string());
            }
            if caller_deposit.amount == Nat::from(0u64) {
                return Err("Caller deposit is 0".to_string());
            }
            if amount > caller_deposit.amount {
                return Err("Amount is more than caller deposit".to_string());
            }

            caller_deposit.amount -= amount.clone();
            pool.tvl -= amount.clone();
            Ok((amount.clone(), bq_btc_address))
        } else {
            Err("No deposit found for caller".to_string())
        }
    })?;

    let mint_result: Result<(), _> = call(bq_btc_address, "mint", (caller, amount_to_mint)).await;

    mint_result.map_err(|err| format!("Error minting BQ BTC: {:?}", err))
}

#[update(name = "claimProposalFunds")]
pub async fn claim_proposal_funds(proposal_id: Nat) -> Result<(), String> {
    let caller = ic_cdk::caller();
    let (gov_canister, bqbtc_canister, cover_canister) = STATE.with(|state| {
        let state = state.borrow();
        let gov_canister = state
            .gov_address
            .ok_or("Governance canister address not set")?;
        let bqbtc_canister = state
            .bq_btc_address
            .ok_or("bqBTC canister address not set")?;
        let cover_canister = state
            .cover_address
            .ok_or("Cover canister address not set")?;
        Ok::<(Principal, Principal, Principal), String>((
            gov_canister,
            bqbtc_canister,
            cover_canister,
        ))
    })?;

    let proposal_details: Result<(Proposal,), _> = call(
        gov_canister,
        "getProposalDetails",
        (caller, proposal_id.clone()),
    )
    .await;
    let (proposal,) = proposal_details.map_err(|_| "Failed to get proposal details")?;
    if proposal.status != ProposalStatus::Approved || proposal.executed {
        return Err("Proposal not approved".to_string());
    }
    if proposal.proposal_param.user != caller {
        return Err("Not a valid proposal".to_string());
    }

    let _ = STATE.with(|state| {
        let mut state = state.borrow_mut();
        let pool = state
            .pools
            .get_mut(&proposal.proposal_param.pool_id)
            .ok_or("Pool should be found")?;

        if !pool.is_active {
            return Err("Pool is not active".to_string());
        }
        if pool.tvl < proposal.proposal_param.claim_amount {
            return Err("Not enough funds in the pool".to_string());
        }

        pool.tcp += proposal.proposal_param.claim_amount.clone();
        pool.tvl -= proposal.proposal_param.claim_amount.clone();

        Ok::<(), String>(())
    });

    let pool_covers = get_pool_covers(proposal.proposal_param.pool_id)
        .await
        .map_err(|_| "Error getting pool covers")?;
    for cover in pool_covers.iter() {
        let update_result: Result<((),), _> = call(
            cover_canister,
            "updateMaxAmount",
            (caller, cover.id.clone()),
        )
        .await;
        update_result.map_err(|_| format!("Failed to update cover id {}", cover.id))?;
    }

    let update_status: Result<((),), _> = call(
        gov_canister,
        "updateProposalStatusToClaimed",
        (caller, proposal_id),
    )
    .await;
    update_status.map_err(|_| "Failed to update proposal status")?;

    let mint_result: Result<((),), _> = call(
        bqbtc_canister,
        "mint",
        (caller, proposal.proposal_param.claim_amount),
    )
    .await;
    mint_result.map_err(|_| "Error minting BQ BTC")?;

    Ok(())
}

#[query(name = "getUserDeposit")]
pub async fn get_user_deposit(pool_id: Nat, user: Principal) -> Result<Deposit, String> {
    STATE.with(|state| {
        let state = state.borrow();
        let pool = state.pools.get(&pool_id).ok_or("Pool should be found")?;

        let user_deposit = pool.deposits.get(&user).ok_or("User deposit not found")?;

        Ok(user_deposit.clone())
    })
}

#[query(name = "getPoolTVL")]
pub async fn get_pool_tvl(pool_id: Nat) -> Result<Nat, String> {
    STATE.with(|state| {
        let state = state.borrow();
        let pool = state.pools.get(&pool_id).ok_or("Pool should be found")?;

        let tvl = pool.tvl.clone();

        Ok(tvl)
    })
}

#[query(name = "getAllParticipants")]
pub async fn get_all_participants() -> Result<Vec<Principal>, String> {
    STATE.with(|state| {
        let state = state.borrow();
        let participants = state.participants.clone();

        Ok(participants)
    })
}

#[query(name = "getOwner")]
fn get_owner() -> Option<Principal> {
    STATE.with(|state| state.borrow().owner)
}

#[update(name = "setOwner")]
fn set_owner(new_owner: Principal) -> Result<(), String> {
    let caller = ic_cdk::caller();
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        if state.owner != Some(caller) {
            return Err("Only the current owner can set a new owner".to_string());
        }
        state.owner = Some(new_owner);
        Ok(())
    })
}

#[update(name = "addNewNetwork")]
fn add_new_network(
    new_network_rpc: String,
    chain_id: u64,
    network_name: String,
    assets: Vec<String>,
) -> Result<(), String> {
    let nat_chain_id = Nat::from(chain_id);
    let caller = ic_cdk::caller();
    let network = Networks {
        name: network_name.clone(),
        rpc_url: new_network_rpc.clone(),
        supported_assets: assets,
    };
    if new_network_rpc.trim().is_empty() || network_name.trim().is_empty() {
        return Err("RPC URL and network name cannot be empty".to_string());
    }
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        if state.owner != Some(caller) {
            return Err("Only the current owner can add new network".to_string());
        }
        if state.supported_networks.contains_key(&nat_chain_id) {
            return Err("Network with this chain_id already exists".to_string());
        }

        state.supported_networks.insert(nat_chain_id, network);
        Ok(())
    })
}

#[update(name = "addNetworkAsset")]
fn add_network_asset(chain_id: u64, asset: String) -> Result<(), String> {
    let nat_chain_id = Nat::from(chain_id);
    let caller = ic_cdk::caller();
    if asset.trim().is_empty() {
        return Err("Asset cannot be empty".to_string());
    }

    STATE.with(|state| {
        let mut state = state.borrow_mut();
        if state.owner != Some(caller) {
            return Err("Only the current owner can add new network".to_string());
        }
        let network = state
            .supported_networks
            .get_mut(&nat_chain_id)
            .ok_or(format!("Network with chain_id {} not found", chain_id))?;
        if !network.supported_assets.contains(&asset) {
            network.supported_assets.push(asset);
        }

        Ok(())
    })
}

#[update(name = "setCover")]
fn set_cover(cover: Principal) -> Result<(), String> {
    let caller = ic_cdk::caller();
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        if state.owner != Some(caller) {
            return Err("Only the current owner can set a new owner".to_string());
        }
        state.cover_address = Some(cover);
        Ok(())
    })
}

#[update(name = "setPoolContractAddress")]
fn set_pool_contract(pool_contract: String) -> Result<(), String> {
    let caller = ic_cdk::caller();
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        if state.owner != Some(caller) {
            return Err("Only the current owner can set a new owner".to_string());
        }
        state.pool_contract = pool_contract;
        Ok(())
    })
}

ic_cdk::export_candid!();
