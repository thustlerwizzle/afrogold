# AfroGold Contracts (Scaffold)

This folder contains docs‑ready scaffolds for the Hedera EVM contracts.

## Governance
- `governance/IGovernance.sol` — interface + events
- `governance/Governance.sol` — minimal storage & event emission (proposal, vote, execute)

## Escrow
- `escrow/IMilestoneEscrow.sol` — interface + events (Deposit, Release, Refund)
- `escrow/MilestoneEscrow.sol` — admin‑controlled stub; in production, add HCS proof verification and DAO admin

## Property NFTs & Marketplace
- `property/PropertyNFTRegistry.sol` — ERC‑721 registry for property and booking NFTs (URI storage)
- `market/BookingMarketplace.sol` — HBAR marketplace for ERC‑721 with optional expiry guard

## Build & Test
```bash
npm i
npx hardhat compile
npx hardhat test
```

## Deploy to Hedera Testnet
1. Fund a testnet wallet in MetaMask (chainId 296)
2. Configure a `testnet` network in `hardhat.config.ts` (RPC: https://testnet.hashio.io/api)
3. Export `PRIVATE_KEY` or use a local .env
4. Create `scripts/deploy.ts` (see example below) and run:
```bash
npx hardhat run scripts/deploy.ts --network testnet
```

Example `scripts/deploy.ts`:
```ts
import { ethers } from "hardhat";

async function main() {
  const Registry = await ethers.getContractFactory("PropertyNFTRegistry");
  const registry = await Registry.deploy();
  await registry.waitForDeployment();

  const Market = await ethers.getContractFactory("BookingMarketplace");
  const market = await Market.deploy();
  await market.waitForDeployment();

  console.log("Registry:", await registry.getAddress());
  console.log("Marketplace:", await market.getAddress());
}

main().catch((e) => { console.error(e); process.exit(1); });
```

## Verify on HashScan (Sourcify)
Hedera uses Sourcify for contract verification, displayed by HashScan.

- Make sure the compiler metadata is emitted (default Hardhat) and optimizer is enabled.
- Use a Sourcify Hardhat plugin or upload `metadata.json` + sources from `artifacts/build-info` via HashScan Verify.

With plugin (example):
```bash
npx hardhat sourcify --chain-id 296 --address <DEPLOYED_ADDRESS>
```

Once verified, HashScan shows a green “Verified” badge and decodes methods.
