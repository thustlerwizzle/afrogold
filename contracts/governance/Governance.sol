// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IGovernance} from "./IGovernance.sol";

/// @title Governance (stub)
/// @notice Docs-ready scaffold defining interfaces, events, and minimal storage
contract Governance is IGovernance {
    struct Proposal {
        address proposer;
        string metadataURI;
        uint256 startBlock;
        uint256 endBlock;
        bool executed;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 abstainVotes;
    }

    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;

    mapping(address => uint256) public votingWeight; // replace with reputation × stake module

    function propose(string calldata metadataURI, uint256 votingPeriodBlocks) external override returns (uint256) {
        uint256 id = ++proposalCount;
        proposals[id] = Proposal({
            proposer: msg.sender,
            metadataURI: metadataURI,
            startBlock: block.number,
            endBlock: block.number + votingPeriodBlocks,
            executed: false,
            forVotes: 0,
            againstVotes: 0,
            abstainVotes: 0
        });
        emit ProposalCreated(id, msg.sender, metadataURI, block.number, block.number + votingPeriodBlocks);
        return id;
    }

    function castVote(uint256 proposalId, uint8 support, uint256 weight) external override {
        require(block.number <= proposals[proposalId].endBlock, "Voting ended");
        // In production: validate voter eligibility and signature; weight = votingWeightOf(voter)
        if (support == 0) proposals[proposalId].againstVotes += weight;
        else if (support == 1) proposals[proposalId].forVotes += weight;
        else proposals[proposalId].abstainVotes += weight;
        emit VoteCast(proposalId, msg.sender, support, weight);
    }

    function execute(uint256 proposalId) external override {
        Proposal storage p = proposals[proposalId];
        require(block.number > p.endBlock, "Voting not ended");
        require(!p.executed, "Executed");
        p.executed = true;
        emit ProposalExecuted(proposalId);
    }

    function votingWeightOf(address voter) public view override returns (uint256) {
        return votingWeight[voter];
    }
}


