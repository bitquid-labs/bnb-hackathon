use alloy::contract::{ContractInstance, Interface};
use alloy::primitives::U256;
use alloy::sol_types::SolCall;
use alloy::transports::http::reqwest::Url;
use alloy::{primitives::Address, sol};
use candid::{CandidType, Deserialize, Nat, Principal};
use evm_rpc_canister_types::EvmRpcCanister;
use ic_cdk::api::call::call;
use ic_cdk::api::management_canister::http_request::{
    http_request, CanisterHttpRequestArgument, HttpHeader, HttpMethod, TransformContext,
};
use ic_cdk_macros::*;
use serde::Serialize;
use serde_json::Value;
use std::collections::HashMap;
use std::{cell::RefCell, str::FromStr};
use types::{
    Deposit, EthCallParams, GenericDepositDetail, JsonRpcRequest, JsonRpcResult, Networks, Pool,
    Proposal, ProposalStatus,
};
use util::{from_hex, to_hex};

mod types;
mod util;

const HTTP_CYCLES: u128 = 100_000_000; // Default cycles for HTTP request
const MAX_RESPONSE_BYTES: u64 = 2048; // Default response size limit

sol! {
    #[derive(Debug, Serialize, Deserialize)]
    interface IERC20 {
        function balanceOf(address account) external view returns (uint256);
    }
}

sol! {
    #[derive(Debug, Serialize, Deserialize)]
    struct GenericDepositDetails {
        address lp;
        uint256 amount;
        uint256 poolId;
        uint256 dailyPayout;
        Status status;
        uint256 daysLeft;
        uint256 startDate;
        uint256 expiryDate;
        uint256 accruedPayout;
        DepositType pdt;
        AssetDepositType adt;
        address asset; // Vault deposit or normal pool deposit?
    }

    #[derive(Debug, Serialize, Deserialize)]
    enum Status {
        Active,
        Due,
        Withdrawn
    }

    #[derive(Debug, Serialize, Deserialize)]
    enum AssetDepositType {
        Native,
        ERC20
    }

    #[derive(Debug, Serialize, Deserialize, PartialEq)]
    enum DepositType {
        Normal,
        Vault
    }

    #[derive(Debug, Serialize, Deserialize)]
    interface IPool {
        function getUserGenericDeposit(uint256 _poolId, address _user, DepositType pdt) external view returns (GenericDepositDetails memory);
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
    icp_pool_contract_address: String,
    icp_pool_canister: Option<Principal>,
    cover_contract: String,
    supported_networks: HashMap<Nat, Networks>, // chain id to the network RPC
}

#[init]
fn init(owner: Principal) {
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        state.owner = Some(owner);
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
        state.supported_networks.clone()
    });

    let mut total_tvl: Nat = Nat::from(0u64);

    for (chain_id, network) in networks {
        match get_network_tvl(network.rpc_url.clone(), chain_id.clone()).await {
            Ok(network_balance) => total_tvl += network_balance,
            Err(e) => {
                ic_cdk::println!("Error getting TVL for chain {}: {}", chain_id, e);
            }
        }
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

        let pool_contract_address = match Address::from_str(&state.icp_pool_contract_address) {
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
                    data: to_hex(&call_data),
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

#[update(name = "Poolwithdraw")]
async fn pool_withdraw(
    pool_id: u64,
    user: String,
    pool_deposit_type: u8,
    chain_id: Nat,
) -> Result<(), String> {
    let caller = ic_cdk::caller();
    let path = std::env::current_dir()
        .expect("msg")
        .join("../testnet-v1-contracts/artifacts/contracts/InsurancePool.sol/InsurancePool.json");
    let artifacts = std::fs::read(path).expect("Failed to read artifact");
    let json: Value = serde_json::from_slice(&artifacts).expect("msg");
    let abi_value = json.get("abi").expect("Failed to get ABI from artifact");
    let abi = serde_json::from_str(&abi_value.to_string()).expect("msg");

    let (network, pool_canister_id) = STATE.with(|state| {
        let state = state.borrow();

        let network = match state.supported_networks.get(&chain_id) {
            Some(network) => network,
            None => panic!("Network with chain_id {} not found", chain_id),
        };

        let canister_id = match state.icp_pool_canister {
            Some(canister_id) => canister_id,
            None => panic!("Not found"),
        };

        (network, canister_id)
    });

    let pool_contract_address = match Address::from_str(&network.evm_pool_contract_address) {
        Ok(address) => address,
        Err(_) => panic!("Error parsing pool contract address"),
    };

    let provider = EvmRpcCanister(pool_canister_id);

    let evm_pool_contract =
        ContractInstance::new(pool_contract_address, provider, Interface::new(abi));

    let user_address = match Address::from_str(&user) {
        Ok(address) => address,
        Err(e) => panic!("Error parsing user address {}", e),
    };

    let pdt = match pool_deposit_type {
        0 => DepositType::Normal,
        1 => DepositType::Vault,
        _ => return Err("Invalid deposit type".to_string()),
    };

    let pool_call = IPool::getUserGenericDepositCall {
        _poolId: U256::from(pool_id),
        _user: user_address,
        pdt: pdt,
    };

    let call_data = pool_call.abi_encode();

    let json_rpc_payload = serde_json::to_string(&JsonRpcRequest {
        id: next_id(),
        jsonrpc: "2.0".to_string(),
        method: "eth_call".to_string(),
        params: (
            EthCallParams {
                to: pool_contract_address.to_string(),
                data: format!("0x{}", to_hex(&call_data)),
            },
            "latest".to_string(),
        ),
    })
    .map_err(|e| format!("Failed to serialize JSON-RPC request: {}", e))?;

    let request_headers = vec![HttpHeader {
        name: "Content-Type".to_string(),
        value: "application/json".to_string(),
    }];

    let request = CanisterHttpRequestArgument {
        url: network.rpc_url.clone(),
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

    let raw_result = json
        .result
        .ok_or("No result in JSON-RPC response".to_string())?;

    let result = from_hex(&raw_result).map_err(|_| "Failed to decode response data".to_string())?;

    let decoded_result = <GenericDepositDetails as SolCall>::abi_decode(&result, false)
        .map_err(|e| format!("Failed to decode response: {}", e))?;
    println!("Decoded Result: {:?}", decoded_result);

    let deposit_detail = GenericDepositDetail {
        lp: decoded_result.lp,
        amount: decoded_result.amount,
        pool_id: decoded_result.poolId,
        daily_payout: decoded_result.dailyPayout,
        status: match decoded_result.status {
            Status::Active => 0,
            Status::Due => 1,
            Status::Withdrawn => 2,
            _ => return Err("Invalid status value".to_string()),
        },
        days_left: decoded_result.daysLeft,
        start_date: decoded_result.startDate,
        expiry_date: decoded_result.expiryDate,
        accrued_payout: decoded_result.accruedPayout,
        pdt: pool_deposit_type,
        adt: decoded_result.adt.into(),
        asset: decoded_result.asset,
    };

    if pdt != DepositType::Normal {
        return Err("Must be pool withdrawal".to_string());
    }

    Ok(())
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

#[query(name = "getUserDeposit")]
pub async fn get_user_deposit(pool_id: Nat, user: Principal) -> Result<Deposit, String> {
    STATE.with(|state| {
        let state = state.borrow();
        let pool = state.pools.get(&pool_id).ok_or("Pool should be found")?;

        let user_deposit = pool.deposits.get(&user).ok_or("User deposit not found")?;

        Ok(user_deposit.clone())
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
    pool_contract: String,
    gov_contract: String,
    cover_contract: String,
) -> Result<(), String> {
    let nat_chain_id = Nat::from(chain_id);
    let caller = ic_cdk::caller();
    let network = Networks {
        name: network_name.clone(),
        rpc_url: new_network_rpc.clone(),
        supported_assets: assets,
        cover_address: cover_contract,
        gov_address: gov_contract,
        evm_pool_contract_address: pool_contract,
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

#[update(name = "setPoolContractAddress")]
fn set_pool_contract(pool_contract: String) -> Result<(), String> {
    let caller = ic_cdk::caller();
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        if state.owner != Some(caller) {
            return Err("Only the current owner can set a new owner".to_string());
        }
        state.icp_pool_contract_address = pool_contract;
        Ok(())
    })
}

ic_cdk::export_candid!();
