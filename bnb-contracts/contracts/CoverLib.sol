// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

library CoverLib {
    struct DepositParams {
        address depositor;
        uint256 poolId;
        uint256 amount;
        uint256 period;
        CoverLib.DepositType pdt;
        CoverLib.AssetDepositType adt;
        address asset;
    }

    struct Cover {
        uint256 id;
        string coverName;
        RiskType riskType;
        string chains;
        uint256 capacity;
        uint256 cost;
        uint256 capacityAmount;
        uint256 coverValues;
        uint256 maxAmount;
        uint256 poolId;
        string CID;
    }

    struct GenericCoverInfo {
        address user;
        uint256 coverId;
        RiskType riskType;
        string coverName;
        uint256 coverValue; // This is the value of the cover purchased
        uint256 claimPaid;
        uint256 coverPeriod; // This is the period the cover is purchased for in days
        uint256 endDay; // When the cover expires
        bool isActive;
    }

    enum RiskType {
        Low,
        Medium,
        High
    }

    struct GenericCover {
        RiskType riskType;
        bytes coverData;
    }

    enum AssetDepositType {
        Native,
        ERC20
    }

    enum DepositType {
        Normal,
        Vault
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
        CoverLib.AssetDepositType assetType;
    }

    struct PoolParams {
        uint256 poolId;
        CoverLib.RiskType riskType;
        string poolName;
        uint256 apy;
        uint256 minPeriod;
        uint8 leverage;
        uint256 investmentArm;
        CoverLib.AssetDepositType adt;
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
        CoverLib.DepositType pdt; // Vault deposit or normal pool deposit?
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

    enum Status {
        Active,
        Due,
        Withdrawn
    }
}