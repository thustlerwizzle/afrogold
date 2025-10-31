// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IMilestoneEscrow} from "./IMilestoneEscrow.sol";

/// @title MilestoneEscrow (stub)
/// @notice Docs-ready scaffold. In production: connect to HCS oracle to verify proof hashes.
contract MilestoneEscrow is IMilestoneEscrow {
    address public admin; // multisig/DAO in production

    constructor(address _admin) {
        admin = _admin;
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    function deposit() external payable override {
        emit Deposit(msg.sender, msg.value);
    }

    function release(
        uint256 milestoneId,
        address payable supplier,
        uint256 amount,
        string calldata proofHash
    ) external override {
        require(msg.sender == admin, "Only admin");
        // TODO: integrate HCS verification before release
        (bool ok, ) = supplier.call{value: amount}("");
        require(ok, "Transfer failed");
        emit MilestoneReleased(milestoneId, supplier, amount, proofHash);
    }

    function refund(address payable funder, uint256 amount) external override {
        require(msg.sender == admin, "Only admin");
        (bool ok, ) = funder.call{value: amount}("");
        require(ok, "Refund failed");
        emit Refunded(funder, amount);
    }
}


