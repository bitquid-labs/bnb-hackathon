// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./CoverLib.sol";

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

    enum Status {
        Active,
        Expired
    }

    function poolActive(uint256 poolId) external view returns (bool);
}

interface IGovToken {
    function mint(address account, uint256 amount) external;
}

interface ICover {
    function updateUserCoverValue(
        address user,
        uint256 _coverId,
        uint256 _claimPaid
    ) external;

    function getUserCoverInfo(
        address user,
        uint256 _coverId
    ) external view returns (CoverLib.GenericCoverInfo memory);
}

contract Governance is ReentrancyGuard, Ownable2Step {
    error VotingTimeElapsed();
    error CannotCreateProposalForThisCoverNow();
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

    struct Voter {
        bool voted;
        bool vote;
        uint256 weight;
    }

    struct ProposalParams {
        address user;
        CoverLib.RiskType riskType;
        uint256 coverId;
        string txHash;
        string description;
        uint256 poolId;
        uint256 claimAmount;
        CoverLib.AssetDepositType adt;
        address asset;
    }

    enum ProposalStaus {
        Submitted,
        Pending,
        Approved,
        Claimed,
        Rejected
    }

    uint256 public proposalCounter;
    uint256 public votingDuration;
    uint256 public REWARD_AMOUNT = 100 * 10 ** 18;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => Voter)) public voters;
    uint256[] public proposalIds;
    mapping(uint256 => address[]) votesFor;
    mapping(uint256 => address[]) votesAgainst;
    address[] public participants;
    mapping(address => uint256) public participation;
    mapping(address => bool) public isAdmin;

    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed creator,
        string description,
        CoverLib.RiskType riskType,
        uint256 claimAmount,
        ProposalStaus status
    );
    event VoteCast(
        address indexed voter,
        uint256 indexed proposalId,
        bool vote,
        uint256 weight
    );
    event ProposalExecuted(uint256 indexed proposalId, bool approved);

    IERC20 public governanceToken;
    ILP public lpContract;
    IGovToken public tokenContract;
    ICover public ICoverContract;
    address public coverContract;
    address public poolContract;

    constructor(
        address _governanceToken,
        address _insurancePool,
        uint256 _votingDuration,
        address _initialOwner
    ) Ownable(_initialOwner) {
        governanceToken = IERC20(_governanceToken);
        tokenContract = IGovToken(_governanceToken);
        lpContract = ILP(_insurancePool);
        poolContract = _insurancePool;
        votingDuration = _votingDuration * 1 days;

        isAdmin[msg.sender] = true;
        isAdmin[0x0Ea40487a37A35A1b04521265A30776cFddAbF33] = true;
        isAdmin[0x5ac313435edB000eEbcEcbc7219D2a6Ee4f1732b] = true;
        isAdmin[0x8664a9EB1fe83aA5A5a68DaC04D03BcD3215Cb4B] = true;
    }

    function createProposal(ProposalParams memory params) external {
        CoverLib.GenericCoverInfo memory userCover = ICoverContract
            .getUserCoverInfo(params.user, params.coverId);
        require(
            params.claimAmount <= userCover.coverValue,
            "Not sufficient cover value for claim"
        );
        require(lpContract.poolActive(params.poolId), "Pool does not exist");
        require(params.claimAmount > 0, "Claim amount must be greater than 0");

        proposalCounter++;

        for (uint256 i = 1; i < proposalCounter; i++) {
            Proposal memory proposal = proposals[i];
            ProposalParams memory param = proposal.proposalParam;

            if (
                param.user == params.user &&
                param.coverId == params.coverId &&
                proposal.status != ProposalStaus.Claimed &&
                proposal.status != ProposalStaus.Rejected
            ) {
                revert CannotCreateProposalForThisCoverNow();
            }
        }

        proposals[proposalCounter] = Proposal({
            id: proposalCounter,
            votesFor: 0,
            votesAgainst: 0,
            createdAt: block.timestamp,
            deadline: 0,
            timeleft: 0,
            executed: false,
            status: ProposalStaus.Submitted,
            proposalParam: params
        });

        proposalIds.push(proposalCounter); // Track the proposal ID

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

        emit ProposalCreated(
            proposalCounter,
            params.user,
            params.description,
            params.riskType,
            params.claimAmount,
            ProposalStaus.Submitted
        );
    }

    function vote(uint256 _proposalId, bool _vote) external {
        require(!voters[_proposalId][msg.sender].voted, "Already voted");
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.createdAt != 0, "Proposal does not exist");
        require(
            msg.sender != proposal.proposalParam.user,
            "You cant vote on your own proposal"
        );

        if (proposal.status == ProposalStaus.Submitted) {
            proposal.status = ProposalStaus.Pending;
            proposal.deadline = block.timestamp + votingDuration;
            proposal.timeleft = (proposal.deadline - block.timestamp) / 1 days;
        } else if (block.timestamp >= proposal.deadline) {
            proposal.timeleft = 0;
            revert VotingTimeElapsed();
        }

        proposal.timeleft = (proposal.deadline - block.timestamp) / 1 days;
        uint256 voterWeight = governanceToken.balanceOf(msg.sender);
        require(voterWeight > 0, "No voting weight");

        voters[_proposalId][msg.sender] = Voter({
            voted: true,
            vote: _vote,
            weight: voterWeight
        });

        if (_vote) {
            votesFor[_proposalId].push(msg.sender);
            proposal.votesFor += voterWeight;
        } else {
            votesAgainst[_proposalId].push(msg.sender);
            proposal.votesAgainst += voterWeight;
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

        emit VoteCast(msg.sender, _proposalId, _vote, voterWeight);
    }

    function executeProposal() external onlyAdmin nonReentrant {
        for (uint256 i = 0; i < proposalIds.length; i++) {
            uint256 proposalId = proposalIds[i];
            Proposal storage proposal = proposals[proposalId];

            if (
                proposal.status == ProposalStaus.Pending &&
                block.timestamp > proposal.deadline &&
                !proposal.executed
            ) {
                proposal.executed = true;
                proposal.timeleft = 0;

                if (proposal.votesFor > proposal.votesAgainst) {
                    proposals[proposalId].status = ProposalStaus.Approved;
                    address[] memory correctVoters = votesFor[proposalId];
                    ICoverContract.updateUserCoverValue(
                        proposal.proposalParam.user,
                        proposal.proposalParam.coverId,
                        proposal.proposalParam.claimAmount
                    );

                    for (uint256 j = 0; j < correctVoters.length; j++) {
                        address voter = correctVoters[j];
                        tokenContract.mint(voter, REWARD_AMOUNT);
                    }

                    emit ProposalExecuted(proposalId, true);
                } else {
                    address[] memory correctVoters = votesAgainst[proposalId];
                    proposals[proposalId].status = ProposalStaus.Rejected;
                    for (uint256 j = 0; j < correctVoters.length; j++) {
                        address voter = correctVoters[j];
                        tokenContract.mint(voter, REWARD_AMOUNT);
                    }
                    emit ProposalExecuted(proposalId, false);
                }
            }
        }
    }

    function updateProposalStatusToClaimed(
        uint256 proposalId
    ) public nonReentrant {
        require(
            msg.sender == proposals[proposalId].proposalParam.user ||
                msg.sender == poolContract,
            "Not the valid proposer"
        );
        proposals[proposalId].status = ProposalStaus.Claimed;
    }

    function setVotingDuration(uint256 _newDuration) external onlyOwner {
        require(_newDuration > 0, "Voting duration must be greater than 0");
        votingDuration = _newDuration;
    }

    function getProposalCount() public view returns (uint256) {
        return proposalCounter;
    }

    function getProposalDetails(
        uint256 _proposalId
    ) external returns (Proposal memory) {
        if (block.timestamp >= proposals[_proposalId].deadline) {
            proposals[_proposalId].timeleft = 0;
        } else {
            proposals[_proposalId].timeleft =
                (proposals[_proposalId].deadline - block.timestamp) /
                1 days;
        }
        return proposals[_proposalId];
    }

    function getAllProposals() public view returns (Proposal[] memory) {
        Proposal[] memory result = new Proposal[](proposalIds.length);
        for (uint256 i = 0; i < proposalIds.length; i++) {
            result[i] = proposals[proposalIds[i]];
            if (block.timestamp >= result[i].deadline) {
                result[i].timeleft = 0;
            } else {
                result[i].timeleft =
                    (result[i].deadline - block.timestamp) /
                    1 days;
            }
        }
        return result;
    }

    function getActiveProposals() public view returns (Proposal[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 0; i < proposalIds.length; i++) {
            if (
                proposals[proposalIds[i]].deadline == 0 ||
                proposals[proposalIds[i]].deadline > block.timestamp
            ) {
                activeCount++;
            }
        }

        Proposal[] memory result = new Proposal[](activeCount);
        uint256 index = 0;
        for (uint256 i = 0; i < proposalIds.length; i++) {
            if (
                proposals[proposalIds[i]].deadline == 0 ||
                proposals[proposalIds[i]].deadline >= block.timestamp
            ) {
                result[index] = proposals[proposalIds[i]];
                if (
                    block.timestamp == result[index].deadline ||
                    proposals[proposalIds[i]].status == ProposalStaus.Submitted
                ) {
                    result[index].timeleft = 0;
                } else {
                    result[index].timeleft =
                        (result[index].deadline - block.timestamp) /
                        1 days;
                }

                index++;
            }
        }
        return result;
    }

    function getPastProposals() public view returns (Proposal[] memory) {
        uint256 pastCount = 0;
        for (uint256 i = 0; i < proposalIds.length; i++) {
            if (
                proposals[proposalIds[i]].status != ProposalStaus.Submitted &&
                proposals[proposalIds[i]].deadline < block.timestamp
            ) {
                pastCount++;
            }
        }
        Proposal[] memory result = new Proposal[](pastCount);
        uint256 index = 0;
        for (uint256 i = 0; i < proposalIds.length; i++) {
            if (
                proposals[proposalIds[i]].status != ProposalStaus.Submitted &&
                proposals[proposalIds[i]].deadline < block.timestamp
            ) {
                result[index] = proposals[proposalIds[i]];
                result[index].timeleft = 0;
                index++;
            }
        }
        return result;
    }

    function getAllParticipants() public view returns (address[] memory) {
        return participants;
    }

    function getUserParticipation(address user) public view returns (uint256) {
        return participation[user];
    }

    function setCoverContract(address _coverContract) external onlyOwner {
        require(coverContract == address(0), "Governance already set");
        require(
            _coverContract != address(0),
            "Governance address cannot be zero"
        );
        ICoverContract = ICover(_coverContract);
        coverContract = _coverContract;
    }

    function safeTransferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner cannot be the zero address");
        transferOwnership(newOwner);
    }

    function updateRewardAmount(uint256 numberofTokens) public onlyAdmin {
        require(numberofTokens > 0);
        REWARD_AMOUNT = numberofTokens * 10 ** 18;
    }

    function addAdmin(address newAdmin) public onlyAdmin {
        isAdmin[newAdmin] = true;
    }

    modifier onlyAdmin() {
        require(isAdmin[msg.sender], "Not authorized");
        _;
    }
}