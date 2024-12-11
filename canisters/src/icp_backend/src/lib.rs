use alloy::network::{EthereumWallet, TransactionBuilder};
use alloy::primitives::U256;
use alloy::providers::Provider;
use alloy::providers::ProviderBuilder;
use alloy::rpc::types::TransactionRequest;
use alloy::signers::icp::IcpSigner;
use alloy::signers::Signer;
use alloy::sol_types::{SolCall, SolValue};
use alloy::transports::http::reqwest::Url;
use alloy::transports::icp::IcpConfig;
use alloy::{primitives::Address, sol};
use candid::{CandidType, Deserialize, Nat, Principal};
use ic_cdk::api::management_canister::http_request::{
    http_request, CanisterHttpRequestArgument, HttpHeader, HttpMethod, TransformContext,
};
use ic_cdk_macros::*;
use serde::Serialize;
use std::collections::HashMap;
use std::{cell::RefCell, str::FromStr};
use types::{
    Deposit, EthCallParams, GenericDepositDetail, JsonRpcRequest, JsonRpcResult, Networks, Pool,
    UserVaultDeposit,
};
use util::{create_icp_signer, from_hex, generate_rpc_service, to_hex};

mod types;
mod util;

const HTTP_CYCLES: u128 = 100_000_000; // Default cycles for HTTP request
const MAX_RESPONSE_BYTES: u64 = 2048; // Default response size limit

sol! {
    #[derive(Debug, Serialize, Deserialize)]
    interface IERC20 {
        function balanceOf(address account) external view returns (uint256);
        function transfer(address recipient, uint256 amount) external returns (bool);

    }
}

sol! {
    #[allow(missing_docs, clippy::too_many_arguments)]
    #[sol(rpc)]
    ERC20Token,
    "../../abi/ERC20.json"
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

    #[derive(Debug, Serialize, Deserialize, PartialEq)]
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
    enum ProposalStaus {
        Submitted,
        Pending,
        Approved,
        Claimed,
        Rejected
    }

    #[derive(Debug, Serialize, Deserialize)]
    struct VaultDeposit {
        address lp;
        uint256 amount;
        uint256 vaultId;
        uint256 dailyPayout;
        Status status;
        uint256 daysLeft;
        uint256 startDate;
        uint256 expiryDate;
        uint256 accruedPayout;
        AssetDepositType assetType;
        address asset;
    }

    #[derive(Debug, Serialize, Deserialize)]
    enum RiskType {
        Low,
        Medium,
        High
    }

    #[derive(Debug, Serialize, Deserialize)]
    struct Proposal {
        uint256 id;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 createdAt;
        uint256 deadline;
        uint256 timeleft;
        ProposalStaus status;
        bool executed;
        ProposalParams proposalParam;
    }

    #[derive(Debug, Serialize, Deserialize)]
    struct ProposalParams {
        address user;
        RiskType riskType;
        uint256 coverId;
        string txHash;
        string description;
        uint256 poolId;
        uint256 claimAmount;
        AssetDepositType adt;
        address asset;
    }

    #[derive(Debug, Serialize, Deserialize)]
    interface IPool {
        function getUserGenericDeposit(uint256 _poolId, address _user, DepositType pdt) external view returns (GenericDepositDetails memory);
    }

    interface IVault {
        function getUserVaultDeposit(uint256 vaultId, address user) public view returns (VaultDeposit memory);
    }

    interface IGov {
        function getProposalDetails(uint256 _proposalId) external returns (Proposal memory);
    }
}

thread_local! {
    static STATE: RefCell<State> = RefCell::default();
    static NONCE: RefCell<Option<u64>> = RefCell::new(None);
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
async fn init(owner: Principal) {
    let signer = create_icp_signer().await;
    let address = signer.address();
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        state.owner = Some(owner);
        state.icp_pool_contract_address = address.to_string();
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
    chain_id: u64,
) -> Result<String, String> {
    let nat_chain_id = Nat::from(chain_id);

    let network = STATE.with(|state| {
        let state = state.borrow();

        let network = match state.supported_networks.get(&nat_chain_id) {
            Some(network) => network,
            None => panic!("Network with chain_id {} not found", chain_id),
        };

        network.clone()
    });

    let pool_contract_address = match Address::from_str(&network.evm_pool_contract_address) {
        Ok(address) => address,
        Err(_) => panic!("Error parsing pool contract address"),
    };

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

    let decoded_result = GenericDepositDetails::abi_decode(&result, false)
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

    let signer = create_icp_signer().await;
    match deposit_detail.adt {
        0 => {
            let hash = match send_eth(
                signer,
                deposit_detail.amount,
                user_address,
                network.rpc_url,
                chain_id,
            )
            .await
            {
                Ok(hash) => hash,
                Err(e) => {
                    return Err(format!("Could not get transaction: {}", e));
                }
            };

            Ok(hash)
        }
        1 => {
            let hash = match send_erc20_token(
                signer,
                deposit_detail.amount,
                user_address,
                network.rpc_url,
                chain_id,
                deposit_detail.asset,
            )
            .await
            {
                Ok(hash) => hash,
                Err(e) => {
                    return Err(format!("Could not get transaction: {}", e));
                }
            };

            Ok(hash)
        }
        _ => {
            return Err(format!("Wrong Asset Deposit Type: {}", deposit_detail.adt));
        }
    }
}

#[update(name = "vaultwithdraw")]
async fn vault_withdraw(
    vault_id: u64,
    user: String,
    pool_deposit_type: u8,
    chain_id: u64,
) -> Result<String, String> {
    let nat_chain_id = Nat::from(chain_id);

    let network = STATE.with(|state| {
        let state = state.borrow();

        let network = match state.supported_networks.get(&nat_chain_id) {
            Some(network) => network,
            None => panic!("Network with chain_id {} not found", chain_id),
        };

        network.clone()
    });

    let vault_contract_address = match Address::from_str(&network.vault_contract) {
        Ok(address) => address,
        Err(_) => panic!("Error parsing vault contract address"),
    };

    let user_address = match Address::from_str(&user) {
        Ok(address) => address,
        Err(e) => panic!("Error parsing user address {}", e),
    };

    let pdt = match pool_deposit_type {
        0 => DepositType::Normal,
        1 => DepositType::Vault,
        _ => return Err("Invalid deposit type".to_string()),
    };

    let vault_call = IVault::getUserVaultDepositCall {
        vaultId: U256::from(vault_id),
        user: user_address,
    };

    let call_data = vault_call.abi_encode();

    let json_rpc_payload = serde_json::to_string(&JsonRpcRequest {
        id: next_id(),
        jsonrpc: "2.0".to_string(),
        method: "eth_call".to_string(),
        params: (
            EthCallParams {
                to: vault_contract_address.to_string(),
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

    let decoded_result = VaultDeposit::abi_decode(&result, false)
        .map_err(|e| format!("Failed to decode response: {}", e))?;
    println!("Decoded Result: {:?}", decoded_result);

    let vault_deposit_detail = UserVaultDeposit {
        lp: decoded_result.lp,
        amount: decoded_result.amount,
        vault_id: decoded_result.vaultId,
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
        adt: decoded_result.assetType.into(),
        asset: decoded_result.asset,
    };

    if pdt != DepositType::Vault {
        return Err("Must be vault withdrawal".to_string());
    }

    let signer = create_icp_signer().await;
    match vault_deposit_detail.adt {
        0 => {
            let hash = match send_eth(
                signer,
                vault_deposit_detail.amount,
                user_address,
                network.rpc_url,
                chain_id,
            )
            .await
            {
                Ok(hash) => hash,
                Err(e) => {
                    return Err(format!("Could not get transaction: {}", e));
                }
            };

            Ok(hash)
        }
        1 => {
            let hash = match send_erc20_token(
                signer,
                vault_deposit_detail.amount,
                user_address,
                network.rpc_url,
                chain_id,
                vault_deposit_detail.asset,
            )
            .await
            {
                Ok(hash) => hash,
                Err(e) => {
                    return Err(format!("Could not get transaction: {}", e));
                }
            };

            Ok(hash)
        }
        _ => {
            return Err(format!(
                "Wrong Asset Deposit Type: {}",
                vault_deposit_detail.adt
            ));
        }
    }
}

#[update(name = "claimProposalFunds")]
async fn claim_proposal_funds(
    proposal_id: u64,
    user: String,
    chain_id: u64,
) -> Result<String, String> {
    let nat_chain_id = Nat::from(chain_id);

    let network = STATE.with(|state| {
        let state = state.borrow();

        let network = match state.supported_networks.get(&nat_chain_id) {
            Some(network) => network,
            None => panic!("Network with chain_id {} not found", chain_id),
        };

        network.clone()
    });

    let gov_contract_address = match Address::from_str(&network.gov_address) {
        Ok(address) => address,
        Err(_) => panic!("Error parsing gov contract address"),
    };

    let user_address = match Address::from_str(&user) {
        Ok(address) => address,
        Err(e) => panic!("Error parsing user address {}", e),
    };

    let gov_call = IGov::getProposalDetailsCall {
        _proposalId: U256::from(proposal_id),
    };

    let call_data = gov_call.abi_encode();

    let json_rpc_payload = serde_json::to_string(&JsonRpcRequest {
        id: next_id(),
        jsonrpc: "2.0".to_string(),
        method: "eth_call".to_string(),
        params: (
            EthCallParams {
                to: gov_contract_address.to_string(),
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

    let decoded_result = Proposal::abi_decode(&result, false)
        .map_err(|e| format!("Failed to decode response: {}", e))?;
    println!("Decoded Result: {:?}", decoded_result);

    let signer = create_icp_signer().await;
    match decoded_result.proposalParam.adt {
        AssetDepositType::Native => {
            let hash = match send_eth(
                signer,
                decoded_result.proposalParam.claimAmount,
                user_address,
                network.rpc_url,
                chain_id,
            )
            .await
            {
                Ok(hash) => hash,
                Err(e) => {
                    return Err(format!("Could not get transaction: {}", e));
                }
            };

            Ok(hash)
        }
        AssetDepositType::ERC20 => {
            let hash = match send_erc20_token(
                signer,
                decoded_result.proposalParam.claimAmount,
                user_address,
                network.rpc_url,
                chain_id,
                decoded_result.proposalParam.asset,
            )
            .await
            {
                Ok(hash) => hash,
                Err(e) => {
                    return Err(format!("Could not get transaction: {}", e));
                }
            };

            Ok(hash)
        }
        _ => {
            return Err(format!(
                "Wrong Asset Deposit Type: {:?}",
                decoded_result.proposalParam.adt
            ));
        }
    }
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
    vault_address: String,
) -> Result<(), String> {
    let nat_chain_id = Nat::from(chain_id);
    let caller = ic_cdk::caller();
    let network = Networks {
        name: network_name.clone(),
        rpc_url: new_network_rpc.clone(),
        supported_assets: assets,
        cover_address: cover_contract,
        gov_address: gov_contract,
        vault_contract: vault_address,
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

async fn send_eth(
    signer: IcpSigner,
    amount: U256,
    to: Address,
    rpc_url: String,
    chain_id: u64,
) -> Result<String, String> {
    let address = signer.address();

    let wallet = EthereumWallet::from(signer);
    let rpc_service = generate_rpc_service(rpc_url);
    let config = IcpConfig::new(rpc_service);
    let provider = ProviderBuilder::new()
        .with_gas_estimation()
        .wallet(wallet)
        .on_icp(config);

    let maybe_nonce = NONCE.with_borrow(|maybe_nonce| maybe_nonce.map(|nonce| nonce + 1));

    let nonce = if let Some(nonce) = maybe_nonce {
        nonce
    } else {
        provider.get_transaction_count(address).await.unwrap_or(0)
    };

    let tx = TransactionRequest::default()
        .with_to(to)
        .with_value(amount)
        .with_nonce(nonce)
        .with_chain_id(chain_id);
    let transport_result = provider.send_transaction(tx.clone()).await;
    match transport_result {
        Ok(builder) => {
            let node_hash = *builder.tx_hash();
            let tx_response = provider.get_transaction_by_hash(node_hash).await.unwrap();

            match tx_response {
                Some(tx) => {
                    NONCE.with_borrow_mut(|nonce| {
                        *nonce = Some(tx.nonce);
                    });
                    Ok(format!("{:?}", tx.hash.to_string()))
                }
                None => Err("Could not get transaction.".to_string()),
            }
        }
        Err(e) => Err(format!("{:?}", e)),
    }
}

async fn send_erc20_token(
    signer: IcpSigner,
    amount: U256,
    to: Address,
    rpc_url: String,
    chain_id: u64,
    token_address: Address,
) -> Result<String, String> {
    let address = signer.address();

    let wallet = EthereumWallet::from(signer);
    let rpc_service = generate_rpc_service(rpc_url);
    let config = IcpConfig::new(rpc_service);
    let provider = ProviderBuilder::new()
        .with_gas_estimation()
        .wallet(wallet)
        .on_icp(config);

    let maybe_nonce = NONCE.with_borrow(|maybe_nonce| maybe_nonce.map(|nonce| nonce + 1));

    let nonce = if let Some(nonce) = maybe_nonce {
        nonce
    } else {
        provider.get_transaction_count(address).await.unwrap_or(0)
    };

    let contract = ERC20Token::new(token_address, provider.clone());

    match contract
        .transfer(to, amount)
        .nonce(nonce)
        .chain_id(chain_id)
        .from(address)
        .send()
        .await
    {
        Ok(builder) => {
            let node_hash = *builder.tx_hash();
            let tx_response = provider.get_transaction_by_hash(node_hash).await.unwrap();

            match tx_response {
                Some(tx) => {
                    NONCE.with_borrow_mut(|nonce| {
                        *nonce = Some(tx.nonce);
                    });
                    Ok(format!("{:?}", tx.hash.to_string()))
                }
                None => Err("Could not get transaction.".to_string()),
            }
        }
        Err(e) => Err(format!("{:?}", e)),
    }
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
