import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", await deployer.getAddress());

  const Registry = await ethers.getContractFactory("PropertyNFTRegistry");
  const registry = await Registry.deploy();
  await registry.waitForDeployment();
  console.log("PropertyNFTRegistry:", await registry.getAddress());

  const Market = await ethers.getContractFactory("BookingMarketplace");
  const market = await Market.deploy();
  await market.waitForDeployment();
  console.log("BookingMarketplace:", await market.getAddress());
}

main().catch((e) => { console.error(e); process.exit(1); });


