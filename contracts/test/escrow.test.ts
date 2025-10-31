import { expect } from "chai";
import { ethers } from "hardhat";

describe("MilestoneEscrow (stub)", function () {
  it("accepts deposits and releases to supplier", async function () {
    const [admin, supplier, funder] = await ethers.getSigners();
    const Escrow = await ethers.getContractFactory("MilestoneEscrow");
    const escrow = await Escrow.connect(admin).deploy(admin.address);
    await escrow.waitForDeployment();

    await expect(
      escrow.connect(funder).deposit({ value: ethers.parseEther("0.5") })
    ).to.emit(escrow, "Deposit");

    await expect(
      escrow.connect(admin).release(1, supplier.address, ethers.parseEther("0.2"), "proof:hash")
    ).to.emit(escrow, "MilestoneReleased");
  });
});
