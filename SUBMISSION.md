# AfroGold — Hedera Africa Hackathon 2025 Final Submission

This document follows the Hedera Africa Hackathon 2025 guidelines. AfroGold makes African infrastructure and luxury stays investable with verifiable transparency using Hedera’s ABFT finality, low predictable fees, and on‑chain governance.

## DoraHacks BUIDL Profile
- **Project Name**: AfroGold (formerly AfreNova)
- **Track**: Onchain Finance & RWA
- **Region**: Africa-first (global investors)
- **Status**: MVP UI live; smart contracts in progress
- **Contact**: team@afrogold.xyz

### Team (each member registers individually)
- Team Lead / Architect (35%) — product architecture, security, RWA model
- Solidity Engineer (30%) — HTS/HCS contracts, governance, escrow
- Frontend/UX (25%) — React/TS, brand, supplier UX
- Business Strategist (10%) — partnerships, compliance, market fit

## Problem Statement
Massive capital avoids African infrastructure and real estate due to unverifiable milestones, weak supplier vetting, and opaque reporting. The result is capital flight and project failure.

## Hedera-Based Solution
AfroGold is a transparent RWA + stays platform. Project shares are tokenized; all critical events (supplier verification, milestone completion, delegated governance) are immutably logged, deterring corruption and empowering investors.

## Hedera Services Used
1. **Hedera Consensus Service (HCS)** — Immutable logs of supplier status changes, milestone proofs, and governance events.
2. **Hedera Token Service (HTS)** — Investment NFTs/tokens, booking NFTs (digital receipts), treasury management.
3. **Smart Contracts (Solidity)** — Governance (proposal/quorum/weight), milestone escrow with HCS preconditions, supplier reputation registry. (Scaffold provided in `contracts/`.)

## What’s Live in the MVP
- React/TS app, MetaMask (EVM) on Hedera testnet with auto chain add/switch
- Investment/booking demo; HashScan links on NFTs
- Suppliers grouped by **Trust Score** and **Voting Weight**; on‑chain verified badge
- Bloomberg-style ticker with Web3/Blockchain/Fintech/AI messaging; animated AfroGold logo

## Architecture (MVP → Phase 2)
- **Frontend**: React/TS, wallet connect, supplier dashboards, NFT links, animated UI
- **Contracts (Phase‑2)**: HTS issuance, governance + escrow (see `contracts/`)
- **Data/Audit**: HCS streams; proofs on IPFS/S3 with on‑chain hashes

## Governance & Tokenization Model
- **E‑NFTs**: investment tokens with rights/tranche metadata
- **K‑NFTs**: booking receipts with perks/loyalty; HashScan explorer links
- **Voting Weight**: stake + reputation (completed milestones & certifications)

## Compliance & Security
- Milestone escrow prevents misappropriation
- Non‑custodial wallets; proofs anchored to HCS
- Optional HTS allowlists for regulatory contexts; KYC via provider

## Roadmap
- **Phase 1** (submitted): MVP UI, NFTs with HashScan links, Trust/Voting UX
- **Phase 2**: Deploy governance + escrow on Hedera EVM, HTS issuance, HCS integration
- **Phase 3**: Compliance rails, yield distribution automation, analytics v2

## KPIs
- Transparency: % projects with on‑chain proofs; dispute resolution time
- Capital: total raised; repeat investment rate
- Suppliers: trust score distribution; milestone success
- Tourism: booking volume; cross‑sell rate

## Pitch Script (60–90s)
“AfroGold makes African infrastructure and luxury stays investable. Hedera’s ABFT finality and low fees power verifiable logs for supplier verification and milestone receipts. Capital moves only when proofs are verified; disputes are voted with weighted governance. Investors get on‑chain receipts and real yield; travelers get premium experiences. With Hedera, we make corruption economically impossible and growth inevitable in Africa.”
