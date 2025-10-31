import { expect } from "chai";
import { ethers } from "hardhat";

describe("Governance (stub)", function () {
  it("creates proposal and accepts votes", async function () {
    const Gov = await ethers.getContractFactory("Governance");
    const gov = await Gov.deploy();
    await gov.waitForDeployment();

    const idTx = await gov.propose("ipfs://proposal-meta", 5);
    await idTx.wait();

    await expect(gov.castVote(1, 1, 100)).to.emit(gov, "VoteCast");
    await ethers.provider.send("hardhat_mine", ["0x10"]);
    await expect(gov.execute(1)).to.emit(gov, "ProposalExecuted");
  });
});
