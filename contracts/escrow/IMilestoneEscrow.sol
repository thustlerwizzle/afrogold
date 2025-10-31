// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IMilestoneEscrow {
    event Deposit(address indexed funder, uint256 amount);
    event MilestoneReleased(uint256 indexed milestoneId, address indexed supplier, uint256 amount, string proofHash);
    event Refunded(address indexed funder, uint256 amount);

    function deposit() external payable;
    function release(uint256 milestoneId, address payable supplier, uint256 amount, string calldata proofHash) external;
    function refund(address payable funder, uint256 amount) external;
}


