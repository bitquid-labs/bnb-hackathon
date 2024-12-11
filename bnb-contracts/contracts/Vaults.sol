// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CoverLib.sol";

interface ICover {
    function updateMaxAmount(uint256 _coverId) external;
    function getDepositClaimableDays(
        address user,
        uint256 _poolId
    ) external view returns (uint256);
    function getLastClaimTime(
        address user,
        uint256 _poolId
    ) external view returns (uint256);
}

interface IbqBTC {
    function bqMint(address account, uint256 amount) external;
    function burn(address account, uint256 amount) external;
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

interface IPool {
    function deposit(
        CoverLib.DepositParams memory depositParam
    ) external payable returns (uint256, uint256);

    function withdrawUpdate(
        address depositor,
        uint256 _poolId,
        CoverLib.DepositType pdt
    ) external;
    function updateVaultWithdrawToDue(
        address user,
        uint256 vaultId,
        uint256 amount
    ) external;

    function getPool(
        uint256 _poolId
    ) external view returns (CoverLib.Pool memory);
}

interface IGov {
    struct ProposalParams {
        address user;
        CoverLib.RiskType riskType;
        uint256 coverId;
        string txHash;
        string description;
        uint256 poolId;
        uint256 claimAmount;
    }

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

    enum ProposalStaus {
        Submitted,
        Pending,
        Approved,
        Claimed,
        Rejected
    }

    function getProposalDetails(
        uint256 _proposalId
    ) external returns (Proposal memory);
    function updateProposalStatusToClaimed(uint256 proposalId) external;
}

contract Vaults is ReentrancyGuard, Ownable {
    using CoverLib for *;

    struct Vault {
        uint256 id;
        string vaultName;
        CoverLib.Pool[] pools;
        uint256 minInv;
        uint256 maxInv;
        uint256 minPeriod;
        CoverLib.AssetDepositType assetType;
        address asset;
    }

    struct Deposits {
        address lp;
        uint256 amount;
        uint256 poolId;
        uint256 dailyPayout;
        CoverLib.Status status;
        uint256 daysLeft;
        uint256 startDate;
        uint256 expiryDate;
        uint256 accruedPayout;
    }

    struct VaultDeposit {
        address lp;
        uint256 amount;
        uint256 vaultId;
        uint256 dailyPayout;
        CoverLib.Status status;
        uint256 daysLeft;
        uint256 startDate;
        uint256 expiryDate;
        uint256 accruedPayout;
        CoverLib.AssetDepositType assetType;
        address asset;
    }

    struct PoolInfo {
        string poolName;
        uint256 poolId;
        uint256 dailyPayout;
        uint256 depositAmount;
        uint256 apy;
        uint256 minPeriod;
        uint256 tvl;
        uint256 tcp; // Total claim paid to users
        bool isActive; // Pool status to handle soft deletion
        uint256 accruedPayout;
    }

    mapping(uint256 => mapping(uint256 => uint256)) vaultPercentageSplits; //vault id to pool id to the pool percentage split;
    mapping(uint256 => Vault) vaults;
    mapping(address => mapping(uint256 => mapping(CoverLib.DepositType => Deposits))) deposits;
    mapping(address => mapping(uint256 => VaultDeposit)) userVaultDeposits;
    uint256 public vaultCount;
    address public governance;
    ICover public ICoverContract;
    IPool public IPoolContract;
    IGov public IGovernanceContract;
    IbqBTC public bqBTC;
    address public poolContract;
    address public bqBTCAddress;
    address public coverContract;
    address public initialOwner;
    address[] public participants;
    mapping(address => uint256) public participation;

    event Deposited(address indexed user, uint256 amount, string pool);
    event Withdraw(address indexed user, uint256 amount, string pool);
    event ClaimPaid(address indexed recipient, string pool, uint256 amount);
    event PoolCreated(uint256 indexed id, string poolName);
    event PoolUpdated(uint256 indexed poolId, uint256 apy, uint256 _minPeriod);
    event ClaimAttempt(uint256, uint256, address);

    constructor(address _initialOwner) Ownable(_initialOwner) {
        initialOwner = _initialOwner;
    }

    function createVault(
        string memory _vaultName,
        uint256[] memory _poolIds,
        uint256[] memory poolPercentageSplit,
        uint256 _minInv,
        uint256 _maxInv,
        uint256 _minPeriod,
        CoverLib.AssetDepositType adt,
        address asset
    ) public onlyOwner {
        require(
            _poolIds.length == poolPercentageSplit.length,
            "Mismatched pool IDs and percentages"
        );
        require(
            adt == CoverLib.AssetDepositType.Native || asset != address(0),
            "Invalid asset for deposit type"
        );

        vaultCount += 1;
        Vault storage vault = vaults[vaultCount];
        vault.id = vaultCount;
        vault.vaultName = _vaultName;
        vault.minInv = _minInv;
        vault.maxInv = _maxInv;
        vault.assetType = adt;
        vault.asset = asset;

        (uint256 percentageSplit, uint256 minPeriod) = validateAndSetPools(
            vault,
            _poolIds,
            poolPercentageSplit,
            adt
        );

        require(
            _minPeriod >= minPeriod,
            "Minimun period must be greater than or equal to the minimum period of all pools within the vault"
        );
        vault.minPeriod = _minPeriod;

        require(percentageSplit == 100, "Total split must equal 100%");
    }

    function initialVaultWithdraw(uint256 _vaultId) public nonReentrant {
        VaultDeposit storage userVaultDeposit = userVaultDeposits[msg.sender][
            _vaultId
        ];
        require(
            userVaultDeposit.amount > 0,
            "No deposit found for this address"
        );
        require(
            userVaultDeposit.status == CoverLib.Status.Active,
            "Deposit is not active"
        );
        require(
            block.timestamp >= userVaultDeposit.expiryDate,
            "Deposit period has not ended"
        );
        Vault memory vault = vaults[_vaultId];
        for (uint256 i = 0; i < vault.pools.length; i++) {
            uint256 poolId = vault.pools[i].id;
            IPoolContract.withdrawUpdate(
                msg.sender,
                poolId,
                CoverLib.DepositType.Vault
            );
        }

        userVaultDeposit.status = CoverLib.Status.Due;

        emit Withdraw(msg.sender, userVaultDeposit.amount, vault.vaultName);
    }

    function vaultDeposit(
        uint256 _vaultId,
        uint256 _amount,
        uint256 _period
    ) public payable nonReentrant {
        Vault memory vault = vaults[_vaultId];
        require(
            _period >= vault.minPeriod,
            "Period cannot be less than the vault min period"
        );
        uint256 totalDailyPayout = 0;
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < vault.pools.length; i++) {
            uint256 poolId = vault.pools[i].id;
            uint256 poolPercentage = vaultPercentageSplits[_vaultId][poolId];
            uint256 percentage_amount = (poolPercentage * _amount) / 100;
            uint256 value = (msg.value * poolPercentage) / 100;
            CoverLib.DepositParams memory depositParam = CoverLib
                .DepositParams({
                    depositor: msg.sender,
                    poolId: poolId,
                    amount: percentage_amount,
                    period: _period,
                    pdt: CoverLib.DepositType.Vault,
                    adt: vault.assetType,
                    asset: vault.asset
                });
            (uint256 amount, uint256 dailyPayout) = IPoolContract.deposit{
                value: value
            }(depositParam);
            totalDailyPayout += dailyPayout;
            totalAmount += amount;
        }

        VaultDeposit memory userDeposit = VaultDeposit({
            lp: msg.sender,
            amount: totalAmount,
            vaultId: _vaultId,
            dailyPayout: totalDailyPayout,
            status: CoverLib.Status.Active,
            daysLeft: _period,
            startDate: block.timestamp,
            expiryDate: block.timestamp + (_period * 1 days),
            accruedPayout: 0,
            assetType: vault.assetType,
            asset: vault.asset
        });
        userVaultDeposits[msg.sender][_vaultId] = userDeposit;
        emit Deposited(msg.sender, _amount, vault.vaultName);
    }

    function validateAndSetPools(
        Vault storage vault,
        uint256[] memory _poolIds,
        uint256[] memory poolPercentageSplit,
        CoverLib.AssetDepositType adt
    ) internal returns (uint256 percentageSplit, uint256 minPeriod) {
        minPeriod = 365;
        for (uint256 i = 0; i < _poolIds.length; i++) {
            CoverLib.Pool memory pool = IPoolContract.getPool(_poolIds[i]);
            require(pool.assetType == adt, "Incompatible asset type in pool");
            percentageSplit += poolPercentageSplit[i];
            vaultPercentageSplits[vault.id][_poolIds[i]] = poolPercentageSplit[
                i
            ];
            vault.pools.push(pool);
            if (pool.minPeriod < minPeriod) {
                minPeriod = pool.minPeriod;
            }
        }
    }

    function getVault(uint256 vaultId) public view returns (Vault memory) {
        return vaults[vaultId];
    }

    function getVaultPools(
        uint256 vaultId
    ) public view returns (CoverLib.Pool[] memory) {
        return vaults[vaultId].pools;
    }

    function getUserVaultPoolDeposits(
        uint256 vaultId,
        address user
    ) public view returns (Deposits[] memory) {
        Vault memory vault = vaults[vaultId];
        Deposits[] memory vaultDeposits = new Deposits[](vault.pools.length);
        for (uint256 i = 0; i < vault.pools.length; i++) {
            uint256 poolId = vault.pools[i].id;
            vaultDeposits[i] = deposits[user][poolId][
                CoverLib.DepositType.Vault
            ];
        }

        return vaultDeposits;
    }

    function getUserVaultDeposit(
        uint256 vaultId,
        address user
    ) public view returns (VaultDeposit memory) {
        return userVaultDeposits[user][vaultId];
    }

    // Revisit who can call this function
    function setUserVaultDepositToZero(
        uint256 vaultId,
        address user
    ) public nonReentrant onlyPool {
        userVaultDeposits[user][vaultId].amount = 0;
    }

    function getVaults() public view returns (Vault[] memory) {
        Vault[] memory allVaults = new Vault[](vaultCount);
        for (uint256 i = 1; i <= vaultCount; i++) {
            allVaults[i - 1] = vaults[i];
        }

        return allVaults;
    }

    function setGovernance(address _governance) external onlyOwner {
        require(governance == address(0), "Governance already set");
        require(_governance != address(0), "Governance address cannot be zero");
        governance = _governance;
        IGovernanceContract = IGov(_governance);
    }

    function setCover(address _coverContract) external onlyOwner {
        require(coverContract == address(0), "Governance already set");
        require(
            _coverContract != address(0),
            "Governance address cannot be zero"
        );
        ICoverContract = ICover(_coverContract);
        coverContract = _coverContract;
    }

    function setPool(address _poolontract) external onlyOwner {
        require(poolContract == address(0), "Governance already set");
        require(
            _poolontract != address(0),
            "Governance address cannot be zero"
        );
        IPoolContract = IPool(_poolontract);
        poolContract = _poolontract;
    }

    modifier onlyGovernance() {
        require(
            msg.sender == governance || msg.sender == initialOwner,
            "Caller is not the governance contract"
        );
        _;
    }

    modifier onlyCover() {
        require(
            msg.sender == coverContract || msg.sender == initialOwner,
            "Caller is not the governance contract"
        );
        _;
    }

    modifier onlyPool() {
        require(
            msg.sender == poolContract || msg.sender == initialOwner,
            "Caller is not the governance contract"
        );
        _;
    }
}