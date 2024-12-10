// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract bqBTC is ERC20, Ownable {
    using SafeERC20 for IERC20;

    uint8 private _customDecimals;
    address public poolAddress;
    address public coverAddress;
    address public initialOwner;
    mapping(uint256 chainId => uint256 multiplier) public networkMultipliers;
    IERC20 public alternativeToken; // 0x6ce8da28e2f864420840cf74474eff5fd80e65b8
    address vaultContract;

    event Mint(
        address indexed account,
        uint256 amount,
        uint256 chainId,
        bool native
    );

    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals_,
        uint256 initialSupply,
        address _initialOwner,
        address _alternativeToken,
        uint256 _multiplier
    ) ERC20(name, symbol) Ownable(_initialOwner) {
        require(
            _multiplier > 0 && _multiplier < 1100,
            "Multiplier must be greater than zero"
        );
        require(_alternativeToken != address(0), "Invalid token address");
        _customDecimals = decimals_;
        _mint(msg.sender, initialSupply);
        initialOwner = _initialOwner;
        alternativeToken = IERC20(_alternativeToken);
        networkMultipliers[block.chainid] = _multiplier;
    }

    function decimals() public view virtual override returns (uint8) {
        return _customDecimals;
    }

    function mint(address account, uint256 btcAmount) external payable {
        uint256 currentChainId = block.chainid;
        uint256 networkMultiplier = networkMultipliers[currentChainId];

        require(networkMultiplier > 0, "No multiplier for this network");
        require(account != address(0), "Invalid account address");

        bool nativeSent = msg.value > 0;
        bool btcSent = false;
        uint256 mintAmount;

        if (nativeSent) {
            mintAmount = (msg.value * networkMultiplier) / 1 ether;
        }

        if (!nativeSent) {
            mintAmount = (btcAmount * networkMultiplier) / 1 ether;
            require(btcAmount > 0, "amount must be greater than 0");
            alternativeToken.safeTransferFrom(
                msg.sender,
                address(this),
                btcAmount
            );
            btcSent = true;
        }

        require(nativeSent || btcSent, "Insufficient tokens sent to mint");
        _mint(account, mintAmount);

        emit Mint(account, mintAmount, currentChainId, nativeSent);
    }

    function burn(address account, uint256 amount) external {
        require(
            msg.sender == initialOwner ||
                msg.sender == poolAddress ||
                msg.sender == coverAddress,
            "not authorized to call he function"
        );
        _burn(account, amount);
    }

    function balanceOf(
        address account
    ) public view virtual override returns (uint256) {
        return super.balanceOf(account);
    }

    function bqMint(address account, uint256 amount) external onlyBQContracts {
        _mint(account, amount);
    }

    function transfer(
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        return super.transfer(to, amount);
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        return super.transferFrom(from, to, amount);
    }

    function approve(
        address spender,
        uint256 amount
    ) public virtual override returns (bool) {
        return super.approve(spender, amount);
    }

    function setContracts(
        address pool,
        address cover,
        address vault
    ) public onlyOwner {
        require(
            pool != address(0) && cover != address(0) && vault != address(0),
            "Address cant be empty"
        );
        require(
            poolAddress == address(0) &&
                coverAddress == address(0) &&
                vaultContract == address(0),
            "Pool address already set"
        );

        coverAddress = cover;
        poolAddress = pool;
        vaultContract = vault;
    }

    function setNetworkMultiplier(
        uint256 chainId,
        uint256 multiplier
    ) external onlyOwner {
        require(
            multiplier > 0 && multiplier < 1100,
            "Multiplier must be greater than zero"
        );
        networkMultipliers[chainId] = multiplier;
    }

    modifier onlyBQContracts() {
        require(
            msg.sender == coverAddress ||
                msg.sender == initialOwner ||
                msg.sender == vaultContract ||
                msg.sender == poolAddress,
            "Caller is not the governance contract"
        );
        _;
    }
}