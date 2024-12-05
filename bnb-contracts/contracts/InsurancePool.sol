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

interface IVault {
    struct Pool {
        uint256 id;
        string poolName;
        CoverLib.RiskType riskType;
        uint256 apy;
        uint256 minPeriod;
        uint256 tvl;
        uint256 baseValue;
        uint256 coverTvl;
        uint256 tcp;
        bool isActive;
        uint256 percentageSplitBalance;
        uint256 investmentArmPercent;
        uint8 leverage;
        address asset;
        CoverLib.AssetDepositType assetType;
    }

    struct Vault {
        uint256 id;
        string vaultName;
        Pool[] pools;
        uint256 minInv;
        uint256 maxInv;
        uint256 minPeriod;
        CoverLib.AssetDepositType assetType;
        address asset;
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
    }

    function getVault(uint256 vaultId) external view returns (Vault memory);
    function getUserVaultDeposit(
        uint256 vaultId,
        address user
    ) external view returns (VaultDeposit memory);
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
    function setUserVaultDepositToZero(uint256 vaultId, address user) external;
}

contract InsurancePool is ReentrancyGuard, Ownable {
    using CoverLib for *;

    mapping(address => mapping(uint256 => mapping(CoverLib.DepositType => CoverLib.Deposits))) deposits;
    mapping(uint256 => CoverLib.Cover[]) poolToCovers;
    mapping(uint256 => CoverLib.Pool) public pools;
    uint256 public poolCount;
    address public governance;
    ICover public ICoverContract;
    IVault public IVaultContract;
    IGov public IGovernanceContract;
    IbqBTC public bqBTC;
    address public bqBTCAddress;
    address public coverContract;
    address public vaultContract;
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

    function createPool(
        CoverLib.PoolParams memory params
    ) public onlyOwner {
        require(
            params.adt == CoverLib.AssetDepositType.Native || params.asset != address(0),
            "Wrong Asset for Deposit"
        );

        poolCount += 1;
        CoverLib.Pool storage newPool = pools[params.poolId];
        newPool.id = params.poolId;
        newPool.poolName = params.poolName;
        newPool.apy = params.apy;
        newPool.minPeriod = params.minPeriod;
        newPool.tvl = 0;
        newPool.coverTvl = 0;
        newPool.baseValue = 0;
        newPool.isActive = true;
        newPool.riskType = params.riskType;
        newPool.investmentArmPercent = params.investmentArm;
        newPool.leverage = params.leverage;
        newPool.percentageSplitBalance = 100 - params.investmentArm;
        newPool.assetType = params.adt;

        emit PoolCreated(params.poolId, params.poolName);
    }

    function updatePool(
        uint256 _poolId,
        uint256 _apy,
        uint256 _minPeriod
    ) public onlyOwner {
        require(pools[_poolId].isActive, "Pool does not exist or is inactive");
        require(_apy > 0, "Invalid APY");
        require(_minPeriod > 0, "Invalid minimum period");

        pools[_poolId].apy = _apy;
        pools[_poolId].minPeriod = _minPeriod;

        emit PoolUpdated(_poolId, _apy, _minPeriod);
    }

    function reducePercentageSplit(
        uint256 _poolId,
        uint256 __poolPercentageSplit
    ) public onlyCover {
        pools[_poolId].percentageSplitBalance -= __poolPercentageSplit;
    }

    function increasePercentageSplit(
        uint256 _poolId,
        uint256 __poolPercentageSplit
    ) public onlyCover {
        pools[_poolId].percentageSplitBalance += __poolPercentageSplit;
    }

    function deactivatePool(uint256 _poolId) public onlyOwner {
        require(pools[_poolId].isActive, "Pool is not active");
        pools[_poolId].isActive = false;
    }

    function getPool(
        uint256 _poolId
    ) public view returns (CoverLib.Pool memory) {
        return pools[_poolId];
    }

    function getAllPools() public view returns (CoverLib.Pool[] memory) {
        CoverLib.Pool[] memory result = new CoverLib.Pool[](poolCount);
        for (uint256 i = 1; i <= poolCount; i++) {
            CoverLib.Pool memory pool = pools[i];
            result[i - 1] = CoverLib.Pool({
                id: i,
                poolName: pool.poolName,
                riskType: pool.riskType,
                apy: pool.apy,
                minPeriod: pool.minPeriod,
                tvl: pool.tvl,
                baseValue: pool.baseValue,
                coverTvl: pool.coverTvl,
                tcp: pool.tcp,
                isActive: pool.isActive,
                percentageSplitBalance: pool.percentageSplitBalance,
                investmentArmPercent: pool.investmentArmPercent,
                leverage: pool.leverage,
                asset: pool.asset,
                assetType: pool.assetType
            });
        }
        return result;
    }

    function updatePoolCovers(
        uint256 _poolId,
        CoverLib.Cover memory _cover
    ) public onlyCover {
        for (uint i = 0; i < poolToCovers[_poolId].length; i++) {
            if (poolToCovers[_poolId][i].id == _cover.id) {
                poolToCovers[_poolId][i] = _cover;
                break;
            }
        }
    }

    function addPoolCover(
        uint256 _poolId,
        CoverLib.Cover memory _cover
    ) public onlyCover {
        poolToCovers[_poolId].push(_cover);
    }

    function getPoolCovers(
        uint256 _poolId
    ) public view returns (CoverLib.Cover[] memory) {
        return poolToCovers[_poolId];
    }

    function getPoolsByAddress(
        address _userAddress
    ) public view returns (CoverLib.PoolInfo[] memory) {
        uint256 resultCount = 0;
        for (uint256 i = 1; i <= poolCount; i++) {
            if (
                deposits[_userAddress][i][CoverLib.DepositType.Normal].amount >
                0
            ) {
                resultCount++;
            }
        }

        CoverLib.PoolInfo[] memory result = new CoverLib.PoolInfo[](resultCount);

        uint256 resultIndex = 0;

        for (uint256 i = 1; i <= poolCount; i++) {
            CoverLib.Pool storage pool = pools[i];
            CoverLib.Deposits memory userDeposit = deposits[_userAddress][i][
                CoverLib.DepositType.Normal
            ];
            uint256 claimableDays = ICoverContract.getDepositClaimableDays(
                _userAddress,
                i
            );
            uint256 accruedPayout = userDeposit.dailyPayout * claimableDays;
            if (
                deposits[_userAddress][i][CoverLib.DepositType.Normal].amount >
                0
            ) {
                result[resultIndex++] = CoverLib.PoolInfo({
                    poolName: pool.poolName,
                    poolId: i,
                    dailyPayout: deposits[_userAddress][i][
                        CoverLib.DepositType.Normal
                    ].dailyPayout,
                    depositAmount: deposits[_userAddress][i][
                        CoverLib.DepositType.Normal
                    ].amount,
                    apy: pool.apy,
                    minPeriod: pool.minPeriod,
                    tvl: pool.tvl,
                    tcp: pool.tcp,
                    isActive: pool.isActive,
                    accruedPayout: accruedPayout
                });
            }
        }
        return result;
    }

    function poolWithdraw(uint256 _poolId) public nonReentrant {
        CoverLib.Pool storage selectedPool = pools[_poolId];
        CoverLib.Deposits storage userDeposit = deposits[msg.sender][_poolId][
            CoverLib.DepositType.Normal
        ];

        require(userDeposit.amount > 0, "No deposit found for this address");
        require(
            userDeposit.status == CoverLib.Status.Active,
            "Deposit is not active"
        );
        require(
            block.timestamp >= userDeposit.expiryDate,
            "Deposit period has not ended"
        );

        userDeposit.status = CoverLib.Status.Withdrawn;
        selectedPool.tvl -= userDeposit.amount;
        uint256 baseValue = selectedPool.tvl -
            ((selectedPool.investmentArmPercent * selectedPool.tvl) / 100);

        uint256 coverTvl = baseValue * selectedPool.leverage;
        selectedPool.coverTvl = coverTvl;
        selectedPool.baseValue = baseValue;
        CoverLib.Cover[] memory poolCovers = getPoolCovers(_poolId);
        for (uint i = 0; i < poolCovers.length; i++) {
            ICoverContract.updateMaxAmount(poolCovers[i].id);
        }

        if (selectedPool.assetType == CoverLib.AssetDepositType.ERC20) {
            bool success = IERC20(selectedPool.asset).transfer(
                msg.sender,
                userDeposit.amount
            );
            require(success, "ERC20 transfer failed");
        } else {
            (bool success, ) = msg.sender.call{value: userDeposit.amount}("");
            require(success, "Native asset transfer failed");
        }

        emit Withdraw(msg.sender, userDeposit.amount, selectedPool.poolName);
    }

    function withdrawUpdate(
        address depositor,
        uint256 _poolId,
        CoverLib.DepositType pdt
    ) public nonReentrant onlyVault {
        CoverLib.Pool storage selectedPool = pools[_poolId];
        CoverLib.Deposits storage userDeposit = deposits[depositor][_poolId][pdt];

        require(userDeposit.amount > 0, "No deposit found for this address");
        require(
            userDeposit.status == CoverLib.Status.Active,
            "Deposit is not active"
        );
        require(
            block.timestamp >= userDeposit.expiryDate,
            "Deposit period has not ended"
        );

        userDeposit.status = CoverLib.Status.Due;
        selectedPool.tvl -= userDeposit.amount;
        uint256 baseValue = selectedPool.tvl -
            ((selectedPool.investmentArmPercent * selectedPool.tvl) / 100);

        uint256 coverTvl = baseValue * selectedPool.leverage;
        selectedPool.coverTvl = coverTvl;
        selectedPool.baseValue = baseValue;
        CoverLib.Cover[] memory poolCovers = getPoolCovers(_poolId);
        for (uint i = 0; i < poolCovers.length; i++) {
            ICoverContract.updateMaxAmount(poolCovers[i].id);
        }

        emit Withdraw(depositor, userDeposit.amount, selectedPool.poolName);
    }

    function vaultWithdraw(uint256 _vaultId) public nonReentrant {
        IVault.VaultDeposit memory userVaultDeposit = IVaultContract
            .getUserVaultDeposit(_vaultId, msg.sender);
        require(userVaultDeposit.amount > 0, "No active withdrawal for user");
        IVault.Vault memory vault = IVaultContract.getVault(_vaultId);
        CoverLib.AssetDepositType adt = vault.assetType;
        if (adt == CoverLib.AssetDepositType.ERC20) {
            bool success = IERC20(vault.asset).transfer(
                msg.sender,
                userVaultDeposit.amount
            );
            require(success, "ERC20 transfer failed");
        } else {
            (bool success, ) = msg.sender.call{value: userVaultDeposit.amount}(
                ""
            );
            require(success, "Native asset transfer failed");
        }

        IVaultContract.getUserVaultDeposit(_vaultId, msg.sender);
    }

    function deposit(
        CoverLib.DepositParams memory depositParam
    ) public payable nonReentrant returns (uint256, uint256) {
        CoverLib.Pool storage selectedPool = pools[depositParam.poolId];

        require(selectedPool.isActive, "Pool is inactive or does not exist");
        require(
            selectedPool.assetType == depositParam.adt,
            "Pool does not accept this deposit type"
        );
        require(
            depositParam.period >= selectedPool.minPeriod,
            "Period too short"
        );
        require(
            selectedPool.asset == depositParam.asset,
            "Pool does not accept this asset"
        );
        require(
            deposits[depositParam.depositor][depositParam.poolId][
                depositParam.pdt
            ].amount == 0,
            "User has already deposited into this pool"
        );

        uint256 price;

        if (selectedPool.assetType == CoverLib.AssetDepositType.ERC20) {
            require(depositParam.amount > 0, "Amount must be greater than 0");
            IERC20(depositParam.asset).transferFrom(
                depositParam.depositor,
                address(this),
                depositParam.amount
            );
            selectedPool.tvl += depositParam.amount;
            price = depositParam.amount;
        } else {
            require(msg.value > 0, "Deposit cannot be zero");
            selectedPool.tvl += msg.value;
            price = msg.value;
        }

        uint256 baseValue = selectedPool.tvl -
            ((selectedPool.investmentArmPercent * selectedPool.tvl) / 100);

        uint256 coverTvl = baseValue * selectedPool.leverage;

        selectedPool.coverTvl = coverTvl;
        selectedPool.baseValue = baseValue;

        uint256 dailyPayout = (price * selectedPool.apy) / 100 / 365;
        CoverLib.Deposits memory userDeposit = CoverLib.Deposits({
            lp: depositParam.depositor,
            amount: price,
            poolId: depositParam.poolId,
            dailyPayout: dailyPayout,
            status: CoverLib.Status.Active,
            daysLeft: depositParam.period,
            startDate: block.timestamp,
            expiryDate: block.timestamp + (depositParam.period * 1 days),
            accruedPayout: 0,
            pdt: depositParam.pdt
        });

        if (depositParam.pdt == CoverLib.DepositType.Normal) {
            deposits[depositParam.depositor][depositParam.poolId][
                CoverLib.DepositType.Normal
            ] = userDeposit;
        } else {
            deposits[depositParam.depositor][depositParam.poolId][
                CoverLib.DepositType.Vault
            ] = userDeposit;
        }

        CoverLib.Cover[] memory poolCovers = getPoolCovers(depositParam.poolId);
        for (uint i = 0; i < poolCovers.length; i++) {
            ICoverContract.updateMaxAmount(poolCovers[i].id);
        }

        bool userExists = false;
        for (uint i = 0; i < participants.length; i++) {
            if (participants[i] == depositParam.depositor) {
                userExists = true;
                break;
            }
        }

        if (!userExists) {
            participants.push(depositParam.depositor);
        }

        participation[depositParam.depositor] += 1;

        emit Deposited(
            depositParam.depositor,
            depositParam.amount,
            selectedPool.poolName
        );

        return (price, dailyPayout);
    }

    function claimProposalFunds(uint256 _proposalId) public nonReentrant {
        IGov.Proposal memory proposal = IGovernanceContract.getProposalDetails(
            _proposalId
        );
        IGov.ProposalParams memory proposalParam = proposal.proposalParam;
        require(
            proposal.status == IGov.ProposalStaus.Approved && proposal.executed,
            "Proposal not approved"
        );
        CoverLib.Pool storage pool = pools[proposalParam.poolId];
        require(msg.sender == proposalParam.user, "Not a valid proposal");
        require(pool.isActive, "Pool is not active");
        require(
            pool.tvl >= proposalParam.claimAmount,
            "Not enough funds in the pool"
        );

        pool.tcp += proposalParam.claimAmount;
        pool.tvl -= proposalParam.claimAmount;
        CoverLib.Cover[] memory poolCovers = getPoolCovers(
            proposalParam.poolId
        );
        for (uint i = 0; i < poolCovers.length; i++) {
            ICoverContract.updateMaxAmount(poolCovers[i].id);
        }

        IGovernanceContract.updateProposalStatusToClaimed(_proposalId);

        emit ClaimAttempt(
            proposalParam.poolId,
            proposalParam.claimAmount,
            proposalParam.user
        );

        bqBTC.bqMint(msg.sender, proposalParam.claimAmount);

        emit ClaimPaid(msg.sender, pool.poolName, proposalParam.claimAmount);
    }

    function getUserDeposit(
        uint256 _poolId,
        address _user
    ) public view returns (CoverLib.Deposits memory) {
        CoverLib.Deposits memory userDeposit = deposits[_user][_poolId][
            CoverLib.DepositType.Normal
        ];
        uint256 claimTime = ICoverContract.getLastClaimTime(_user, _poolId);
        uint lastClaimTime;
        if (claimTime == 0) {
            lastClaimTime = userDeposit.startDate;
        } else {
            lastClaimTime = claimTime;
        }
        uint256 currentTime = block.timestamp;
        if (currentTime > userDeposit.expiryDate) {
            currentTime = userDeposit.expiryDate;
        }
        uint256 claimableDays = (currentTime - lastClaimTime) / 5 minutes;
        userDeposit.accruedPayout = userDeposit.dailyPayout * claimableDays;
        if (userDeposit.expiryDate <= block.timestamp) {
            userDeposit.daysLeft = 0;
        } else {
            uint256 timeLeft = userDeposit.expiryDate - block.timestamp;
            userDeposit.daysLeft = (timeLeft + 1 days - 1) / 1 days;
        }
        return userDeposit;
    }

    function getPoolTVL(uint256 _poolId) public view returns (uint256) {
        return pools[_poolId].tvl;
    }

    function poolActive(uint256 poolId) public view returns (bool) {
        CoverLib.Pool storage pool = pools[poolId];
        return pool.isActive;
    }

    function getAllParticipants() public view returns (address[] memory) {
        return participants;
    }

    function getUserParticipation(address user) public view returns (uint256) {
        return participation[user];
    }

    function setGovernance(address _governance) external onlyOwner {
        require(governance == address(0), "Governance already set");
        require(_governance != address(0), "Governance address cannot be zero");
        governance = _governance;
        IGovernanceContract = IGov(_governance);
    }

    function setCover(address _coverContract) external onlyOwner {
        require(coverContract == address(0), "Cover already set");
        require(_coverContract != address(0), "Cover address cannot be zero");
        ICoverContract = ICover(_coverContract);
        coverContract = _coverContract;
    }

    function setVault(address _vaultContract) external onlyOwner {
        require(vaultContract == address(0), "Vault already set");
        require(_vaultContract != address(0), "Vault address cannot be zero");
        IVaultContract = IVault(_vaultContract);
        vaultContract = _vaultContract;
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
            "Caller is not the cover contract"
        );
        _;
    }

    modifier onlyVault() {
        require(
            msg.sender == vaultContract || msg.sender == initialOwner,
            "Caller is not the vault contract"
        );
        _;
    }
}