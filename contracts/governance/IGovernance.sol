// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IGovernance {
    /// @notice Emitted when a proposal is created
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string metadataURI,
        uint256 startBlock,
        uint256 endBlock
    );

    /// @notice Emitted when a vote is cast
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        uint8 support,
        uint256 weight
    );

    /// @notice Emitted when a proposal is executed
    event ProposalExecuted(uint256 indexed proposalId);

    function propose(string calldata metadataURI, uint256 votingPeriodBlocks) external returns (uint256);
    function castVote(uint256 proposalId, uint8 support, uint256 weight) external;
    function execute(uint256 proposalId) external;
    function votingWeightOf(address voter) external view returns (uint256);
}


