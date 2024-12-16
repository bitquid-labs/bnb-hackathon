// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "./CoverLib.sol";

interface IbqBTC {
    function bqMint(address account, uint256 amount) external;
    function burn(address account, uint256 amount) external;
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

interface IVault {
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

    function getVault(uint256 vaultId) external view returns (Vault memory)
}

interface ILP {
    struct Deposits {
        address lp;
        uint256 amount;
        uint256 poolId;
        uint256 dailyPayout;
        Status status;
        uint256 daysLeft;
        uint256 startDate;
        uint256 expiryDate;
        uint256 accruedPayout;
    }

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
        AssetDepositType assetType;
    }

    enum Status {
        Active,
        Expired
    }

    enum AssetDepositType {
        Native,
        ERC20
    }

    function getUserDeposit(
        uint256 _poolId,
        address _user
    ) external view returns (Deposits memory);

    function getVaultDeposits(
        uint256 vaultId,
        address user
    ) external view returns (Deposits[] memory);

    function getPool(
        uint256 _poolId
    )
        external
        view
        returns (CoverLib.Pool memory);

    function reducePercentageSplit(
        uint256 _poolId,
        uint256 __poolPercentageSplit
    ) external;
    function increasePercentageSplit(
        uint256 _poolId,
        uint256 __poolPercentageSplit
    ) external;
    function addPoolCover(
        uint256 _poolId,
        CoverLib.Cover memory _cover
    ) external;
    function updatePoolCovers(
        uint256 _poolId,
        CoverLib.Cover memory _cover
    ) external;
    function getPoolCovers(
        uint256 _poolId
    ) external view returns (CoverLib.Cover[] memory);
}

contract InsuranceCover is ReentrancyGuard, Ownable {
    using CoverLib for *;
    using Math for uint256;

    error LpNotActive();
    error InsufficientPoolBalance();
    error NoClaimableReward();
    error InvalidCoverDuration();
    error CoverNotAvailable();
    error UserHaveAlreadyPurchasedCover();
    error NameAlreadyExists();
    error InvalidAmount();
    error UnsupportedCoverType();
    error WrongPool();

    uint public coverFeeBalance;
    ILP public lpContract;
    IbqBTC public bqBTC;
    IVault public vaultContract;
    address public bqBTCAddress;
    address public lpAddress;
    address public governance;
    address public vaultAddress;
    address[] public participants;
    mapping(address => uint256) public participation;

    mapping(uint256 => bool) public coverExists;
    mapping(address => mapping(uint256 => uint256)) public NextLpClaimTime;
    mapping(address => mapping(uint256 => uint256)) public LastVaultClaimTime;

    mapping(address => mapping(uint256 => CoverLib.GenericCoverInfo))
        public userCovers;
    mapping(uint256 => CoverLib.Cover) public covers;

    uint256 public coverCount;
    uint256[] public coverIds;

    event CoverCreated(
        uint256 indexed coverId,
        string name,
        CoverLib.RiskType riskType
    );
    event CoverPurchased(
        address indexed user,
        uint256 coverValue,
        uint256 coverFee,
        CoverLib.RiskType riskType
    );
    event PayoutClaimed(
        address indexed user,
        uint256 indexed poolId,
        uint256 amount
    );
    event CoverUpdated(
        uint256 indexed coverId,
        string coverName,
        CoverLib.RiskType riskType
    );

    constructor(
        address _lpContract,
        address _vaultContract,
        address _initialOwner,
        address _bqBTC
    ) Ownable(_initialOwner) {
        lpContract = ILP(_lpContract);
        vaultContract = IVault(_vaultContract);
        vaultAddress = _vaultContract;
        lpAddress = _lpContract;
        bqBTC = IbqBTC(_bqBTC);
        bqBTCAddress = _bqBTC;
    }

    function createCover(
        uint256 coverId,
        string memory _cid,
        CoverLib.RiskType _riskType,
        string memory _coverName,
        string memory _chains,
        uint256 _capacity,
        uint256 _cost,
        uint256 _poolId
    ) public onlyOwner {
        (uint256 _maxAmount, address _asset, CoverLib.AssetDepositType _adt) = _validateAndGetPoolInfo(
            _coverName,
            _poolId,
            _riskType,
            _capacity
        );

        lpContract.reducePercentageSplit(_poolId, _capacity);

        coverCount++;
        CoverLib.Cover memory cover = CoverLib.Cover({
            id: coverId,
            coverName: _coverName,
            riskType: _riskType,
            chains: _chains,
            capacity: _capacity,
            cost: _cost,
            capacityAmount: _maxAmount,
            coverValues: 0,
            maxAmount: _maxAmount,
            poolId: _poolId,
            CID: _cid,
            adt: _adt,
            asset: _asset
        });
        covers[coverId] = cover;
        coverIds.push(coverId);
        lpContract.addPoolCover(_poolId, cover);
        coverExists[coverId] = true;

        emit CoverCreated(coverId, _coverName, _riskType);
    }

    function _validateAndGetPoolInfo(
        string memory _coverName,
        uint256 poolId,
        CoverLib.RiskType riskType,
        uint256 capacity
    ) internal view returns (uint256, address, CoverLib.AssetDepositType) {
        CoverLib.Cover[] memory coversInPool = lpContract.getPoolCovers(poolId);
        for (uint256 i = 0; i < coversInPool.length; i++) {
            if (
                keccak256(abi.encodePacked(coversInPool[i].coverName)) ==
                keccak256(abi.encodePacked(_coverName))
            ) {
                revert NameAlreadyExists();
            }
        }
        CoverLib.Pool memory pool = lpContract.getPool(poolId);

        if (pool.riskType != riskType || capacity > pool.percentageSplitBalance) {
            revert WrongPool();
        }

        uint256 maxAmount = (pool.tvl * capacity) / 100;
        return (maxAmount, pool.asset, pool.assetType);
    }

    function updateCover(
        uint256 _coverId,
        string memory _coverName,
        CoverLib.RiskType _riskType,
        string memory _cid,
        string memory _chains,
        uint256 _capacity,
        uint256 _cost,
        uint256 _poolId
    ) public onlyOwner {
        CoverLib.Pool memory pool = lpContract.getPool(_poolId);

        if (pool.riskType != _riskType || _capacity > pool.percentageSplitBalance) {
            revert WrongPool();
        }

        CoverLib.Cover storage cover = covers[_coverId];

        uint256 _maxAmount = (pool.tvl * ((_capacity * 1e18) / 100)) / 1e18;

        if (cover.coverValues > _maxAmount) {
            revert WrongPool();
        }

        CoverLib.Cover[] memory coversInPool = lpContract.getPoolCovers(
            _poolId
        );
        for (uint256 i = 0; i < coversInPool.length; i++) {
            if (
                keccak256(abi.encodePacked(coversInPool[i].coverName)) ==
                keccak256(abi.encodePacked(_coverName)) &&
                coversInPool[i].id != _coverId
            ) {
                revert NameAlreadyExists();
            }
        }

        uint256 oldCoverCapacity = cover.capacity;

        cover.coverName = _coverName;
        cover.chains = _chains;
        cover.capacity = _capacity;
        cover.cost = _cost;
        cover.CID = _cid;
        cover.capacityAmount = _maxAmount;
        cover.poolId = _poolId;
        cover.maxAmount = _maxAmount - cover.coverValues;

        if (oldCoverCapacity > _capacity) {
            uint256 difference = oldCoverCapacity - _capacity;
            lpContract.increasePercentageSplit(_poolId, difference);
        } else if (oldCoverCapacity < _capacity) {
            uint256 difference = _capacity - oldCoverCapacity;
            lpContract.reducePercentageSplit(_poolId, difference);
        }

        lpContract.updatePoolCovers(_poolId, cover);

        emit CoverUpdated(_coverId, _coverName, _riskType);
    }

    function purchaseCover(
        uint256 _coverId,
        uint256 _coverValue,
        uint256 _coverPeriod,
        uint256 _coverFee
    ) public payable nonReentrant {
        if (_coverFee <= 0) {
            revert InvalidAmount();
        }
        if (_coverPeriod <= 27 || _coverPeriod >= 366) {
            revert InvalidCoverDuration();
        }
        if (!coverExists[_coverId]) {
            revert CoverNotAvailable();
        }

        CoverLib.Cover storage cover = covers[_coverId];

        if (_coverValue > cover.maxAmount) {
            revert InsufficientPoolBalance();
        }

        uint256 newCoverValues = cover.coverValues + _coverValue;

        if (newCoverValues > cover.capacityAmount) {
            revert InsufficientPoolBalance();
        }

        if (cover.adt == CoverLib.AssetDepositType.ERC20) {
            bool success = IERC20(cover.asset).transferFrom(msg.sender, address(this), _coverFee);
            require(success, "ERC20 transfer failed");
        } else {
            require(msg.value > 0, "Cover value cannot be zero");
            (bool sent, ) = payable(address(this)).call{value: msg.value}("");
            require(sent, "Failed to purchase cover");
            coverFeeBalance += _coverFee;
        }

        cover.coverValues = newCoverValues;
        cover.maxAmount = cover.capacityAmount - newCoverValues;

        cover.maxAmount = (cover.capacityAmount - cover.coverValues);
        CoverLib.GenericCoverInfo storage userCover = userCovers[msg.sender][
            _coverId
        ];

        if (userCover.coverValue == 0) {
            userCovers[msg.sender][_coverId] = CoverLib.GenericCoverInfo({
                user: msg.sender,
                coverId: _coverId,
                riskType: cover.riskType,
                coverName: cover.coverName,
                coverValue: _coverValue,
                claimPaid: 0,
                coverPeriod: _coverPeriod,
                endDay: block.timestamp + (_coverPeriod * 1 days),
                isActive: true
            });
        } else {
            revert UserHaveAlreadyPurchasedCover();
        }

        bool userExists = false;
        for (uint i = 0; i < participants.length; i++) {
            if (participants[i] == msg.sender) {
                userExists = true;
                break;
            }
        }

        if (!userExists) {
            participants.push(msg.sender);
        }
        participation[msg.sender] += 1;

        emit CoverPurchased(msg.sender, _coverValue, _coverFee, cover.riskType);
    }

    function getAllUserCovers(
        address user
    ) external view returns (CoverLib.GenericCoverInfo[] memory) {
        uint256 actualCount = 0;
        for (uint256 i = 0; i < coverIds.length; i++) {
            uint256 id = coverIds[i];
            if (userCovers[user][id].coverValue > 0) {
                actualCount++;
            }
        }

        CoverLib.GenericCoverInfo[]
            memory userCoverList = new CoverLib.GenericCoverInfo[](actualCount);

        uint256 index = 0;
        for (uint256 i = 0; i < coverIds.length; i++) {
            uint256 id = coverIds[i];
            if (userCovers[user][id].coverValue > 0) {
                userCoverList[index] = userCovers[user][id];
                index++;
            }
        }

        return userCoverList;
    }

    function getAllAvailableCovers()
        external
        view
        returns (CoverLib.Cover[] memory)
    {
        uint256 actualCount = 0;
        for (uint256 i = 0; i < coverIds.length; i++) {
            uint256 id = coverIds[i];
            if (coverExists[id]) {
                actualCount++;
            }
        }

        CoverLib.Cover[] memory availableCovers = new CoverLib.Cover[](
            actualCount
        );

        uint256 index = 0;
        for (uint256 i = 0; i < coverIds.length; i++) {
            uint256 id = coverIds[i];
            if (coverExists[id]) {
                availableCovers[index] = covers[id];
                index++;
            }
        }

        return availableCovers;
    }

    function getCoverInfo(
        uint256 _coverId
    ) external view returns (CoverLib.Cover memory) {
        return covers[_coverId];
    }

    function getUserCoverInfo(
        address user,
        uint256 _coverId
    ) external view returns (CoverLib.GenericCoverInfo memory) {
        return userCovers[user][_coverId];
    }

    function updateUserCoverValue(
        address user,
        uint256 _coverId,
        uint256 _claimPaid
    ) public onlyGovernance nonReentrant {
        userCovers[user][_coverId].coverValue -= _claimPaid;
        userCovers[user][_coverId].claimPaid += _claimPaid;
    }

    function deleteExpiredUserCovers(address _user) external nonReentrant {
        for (uint256 i = 1; i < coverIds.length; i++) {
            uint256 id = coverIds[i];
            CoverLib.GenericCoverInfo storage userCover = userCovers[_user][id];
            if (userCover.isActive && block.timestamp > userCover.endDay) {
                userCover.isActive = false;
                delete userCovers[_user][id];
            }
        }
    }

    function getCoverFeeBalance() external view returns (uint256) {
        return coverFeeBalance;
    }

    function updateMaxAmount(uint256 _coverId) public onlyPool nonReentrant {
        CoverLib.Cover storage cover = covers[_coverId];
        CoverLib.Pool memory pool = lpContract.getPool(cover.poolId);
        require(cover.capacity > 0, "Invalid cover capacity");
        uint256 amount = (pool.totalUnit * cover.capacity) / 100;
        covers[_coverId].capacityAmount = amount;
        covers[_coverId].maxAmount = (covers[_coverId].capacityAmount -
            covers[_coverId].coverValues);
    }

    function claimPayoutForLP(uint256 _poolId) external nonReentrant {
        ILP.Deposits memory depositInfo = lpContract.getUserDeposit(
            _poolId,
            msg.sender
        );
        if (depositInfo.status != ILP.Status.Active) {
            revert LpNotActive();
        }

        uint256 lastClaimTime;
        if (NextLpClaimTime[msg.sender][_poolId] == 0) {
            lastClaimTime = depositInfo.startDate;
        } else {
            lastClaimTime = NextLpClaimTime[msg.sender][_poolId];
        }

        uint256 currentTime = block.timestamp;
        if (currentTime > depositInfo.expiryDate) {
            currentTime = depositInfo.expiryDate;
        }

        uint256 claimableDays = (currentTime - lastClaimTime) / 1 days;

        if (claimableDays <= 0) {
            revert NoClaimableReward();
        }
        uint256 claimableAmount = depositInfo.dailyPayout * claimableDays;

        uint256 assetCoverFeeBalance;
        CoverLib.Pool memory selectedPool = lpContract.getPool(_poolId);

        if (selectedPool.assetType == CoverLib.AssetDepositType.ERC20) {
            uint256 balance = IERC20(selectedPool.asset).balanceOf(address(this));
            assetCoverFeeBalance = balance;
        } else {
            assetCoverFeeBalance = coverFeeBalance;
        }

        if (claimableAmount > assetCoverFeeBalance) {
            revert InsufficientCoverBalance();
        }
        NextLpClaimTime[msg.sender][_poolId] = block.timestamp;

        if (selectedPool.assetType == CoverLib.AssetDepositType.ERC20) {
            bool success = IERC20(selectedPool.asset).transfer(
                msg.sender,
                claimableAmount
            );
            require(success, "ERC20 transfer failed");
        } else {
            (bool success, ) = msg.sender.call{value: claimableAmount}("");
            require(success, "Native asset transfer failed");
            coverFeeBalance -= claimableAmount;
        }

        emit PayoutClaimed(msg.sender, _poolId, claimableAmount);
    }

    function clamPayoutForVault(uint256 vaultId) external nonReentrant {
        ILP.Deposits[] memory deposits = lpContract.getVaultDeposits(
            vaultId,
            msg.sender
        );
        uint256 totalClaim;
        uint256 lastClaimTime;
        if (LastVaultClaimTime[msg.sender][vaultId] == 0) {
            lastClaimTime = deposits[0].startDate;
        } else {
            lastClaimTime = LastVaultClaimTime[msg.sender][vaultId];
        }

        uint256 currentTime = block.timestamp;
        if (currentTime > deposits[0].expiryDate) {
            currentTime = deposits[0].expiryDate;
        }
        uint256 claimableDays = (currentTime - lastClaimTime) / 5 minutes;

        for (uint256 i = 0; i < deposits.length; i++) {
            ILP.Deposits memory deposit = deposits[i];
            uint256 claimableAmount = deposit.dailyPayout * claimableDays;
            totalClaim += claimableAmount;
        }

        uint256 assetCoverFeeBalance;
        vaultContract.Vault memory selectedVault = vaultContract.getVault(vaultId);

        if (selectedVault.assetType == CoverLib.AssetDepositType.ERC20) {
            uint256 balance = IERC20(selectedVault.asset).balanceOf(address(this));
            assetCoverFeeBalance = balance;
        } else {
            assetCoverFeeBalance = coverFeeBalance;
        }

        if (totalClaim > assetCoverFeeBalance) {
            revert InsufficientCoverBalance();
        }

        LastVaultClaimTime[msg.sender][vaultId] = block.timestamp;
        if (selectedVault.assetType == CoverLib.AssetDepositType.ERC20) {
            bool success = IERC20(selectedVault.asset).transfer(
                msg.sender,
                totalClaim
            );
            require(success, "ERC20 transfer failed");
        } else {
            (bool success, ) = msg.sender.call{value: totalClaim}("");
            require(success, "Native asset transfer failed");
            coverFeeBalance -= totalClaim;
        }

        emit PayoutClaimed(msg.sender, vaultId, totalClaim);
    }

    function getDepositClaimableDays(
        address user,
        uint256 _poolId
    ) public view returns (uint256) {
        ILP.Deposits memory depositInfo = lpContract.getUserDeposit(
            _poolId,
            user
        );

        uint256 lastClaimTime;
        if (NextLpClaimTime[user][_poolId] == 0) {
            lastClaimTime = depositInfo.startDate;
        } else {
            lastClaimTime = NextLpClaimTime[user][_poolId];
        }
        uint256 currentTime = block.timestamp;
        if (currentTime > depositInfo.expiryDate) {
            currentTime = depositInfo.expiryDate;
        }
        uint256 claimableDays = (currentTime - lastClaimTime) / 5 minutes;

        return claimableDays;
    }

    function getLastClaimTime(
        address user,
        uint256 _poolId
    ) public view returns (uint256) {
        return NextLpClaimTime[user][_poolId];
    }

    function getAllParticipants() public view returns (address[] memory) {
        return participants;
    }

    function getUserParticipation(address user) public view returns (uint256) {
        return participation[user];
    }

    modifier onlyGovernance() {
        require(msg.sender == governance, "Not authorized");
        _;
    }

    modifier onlyPool() {
        require(msg.sender == lpAddress, "Not authorized");
        _;
    }
}