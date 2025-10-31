# AfroGold — Luxury Stays & Transparent Infrastructure Investing on Hedera

> **Track**: Onchain Finance & RWA (Real World Assets)  
> **Hackathon**: Hedera Africa Hackathon 2025  
> **Live Demo**: [https://afrogold-app.netlify.app/](https://afrogold-app.netlify.app/)

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Pitch Deck & Certification](#pitch-deck--certification)
- [Hedera Integration Summary](#hedera-integration-summary)
- [Deployment & Setup](#deployment--setup)
- [Architecture](#architecture)
- [Key IDs & Security](#key-ids--security)
- [Judge Credentials](#judge-credentials)
- [Code Quality](#code-quality)

---

## 🎯 Project Overview

**AfroGold** is a transparent investment platform that tokenizes African infrastructure projects and luxury stays, powered by Hedera's ABFT consensus. We solve the $90 billion annual corruption problem in African infrastructure by providing verifiable, on-chain transparency for every project milestone, supplier verification, and investment receipt.

### Key Features

- **Infrastructure Investment NFTs**: Tokenized project shares with verifiable milestones
- **Luxury Booking NFTs**: Digital receipts for property bookings with resale marketplace
- **Supplier Verification**: On-chain trust scores based on Hedera governance participation
- **Anti-Corruption Transparency**: Immutable logs of all critical events
- **MetaMask Integration**: Seamless wallet connection to Hedera Testnet
- **Real-time Chat**: Host-guest communication for bookings

---

## 📄 Pitch Deck & Certification

- **📊 Pitch Deck**: [View on Google Gemini](https://gemini.google.com/share/c157149265a2)
- **🏆 Hedera Certification**: [Download PDF Certificate](https://certs.hashgraphdev.com/bbfe9f1c-5ad7-43d4-93ff-68310a769a73.pdf)
- **🌐 Live Application**: [https://afrogold-app.netlify.app/](https://afrogold-app.netlify.app/)

---

## ⛓️ Hedera Integration Summary

AfroGold leverages three core Hedera services to deliver verifiable transparency and anti-corruption guarantees:

### 1. Hedera Token Service (HTS)

**Why HTS?** We chose HTS for its regulatory compliance, predictable fees ($0.001 per mint/transfer), and native integration with Hedera's ecosystem. Unlike ERC-721 tokens on other chains, HTS tokens benefit from ABFT finality (guaranteed finality in 3-5 seconds), making them ideal for financial instruments.

**Implementation:**
- **Token ID**: `0.0.7118319` (Hotel Booking NFT collection)
- **Treasury Account**: `0.0.7054981`
- **Use Cases**:
  - Property NFTs: Each listed property is minted as an HTS NFT with metadata (location, price, amenities)
  - Booking NFTs: Digital receipts for confirmed bookings, stored as HTS serials
  - Project Investment NFTs: Fractional ownership tokens for infrastructure projects

**Transaction Types:**
- `TokenMint`: Create new NFTs for properties/bookings (`~$0.001`)
- `TokenTransfer`: Transfer booking NFTs between users (`~$0.001`)
- `TokenAssociate`: Link accounts to token types (one-time fee)

**Economic Justification**: At 0.001 HBAR per transaction, minting 10,000 booking NFTs costs only 10 HBAR (~$0.10). This micro-fee model enables massive scale while maintaining full on-chain transparency.

---

### 2. Hedera Consensus Service (HCS)

**Why HCS?** HCS provides immutable, tamper-proof logs of all critical events. With ABFT finality, once a message is logged, it cannot be altered or deleted—essential for anti-corruption auditing and supplier verification.

**Implementation:**
- **Topic IDs**: One topic per project for milestone logs
- **Use Cases**:
  - Supplier status changes: Log when a supplier is verified, suspended, or upgraded
  - Milestone completion proofs: Hash and timestamp of completion documents
  - Governance votes: Immutable records of proposal voting
  - Booking events: Audit trail for property bookings and transfers

**Transaction Types:**
- `TopicCreate`: Initialize new project topics (`~$0.01`)
- `TopicMessageSubmit`: Submit milestone/event logs (`~$0.0001`)

**Economic Justification**: At $0.0001 per message, logging 100,000 milestone events costs only 10 HBAR. This enables granular, cost-effective transparency that traditional auditing cannot match.

---

### 3. Smart Contracts (Hedera EVM)

**Why Hedera EVM?** Hedera's EVM compatibility allows us to leverage existing Solidity tooling (OpenZeppelin, Hardhat) while benefiting from Hedera's low fees and fast finality. Transactions on Hedera EVM cost ~$0.05 (gas-based) vs. $5-50 on Ethereum mainnet.

**Implementation:**
- **Contract Addresses**:
  - `PropertyNFTRegistry`: `0xb1F616b8134F602c3Bb465fB5b5e6565cCAd37Ed` (ERC-721 for properties)
  - `BookingMarketplace`: `0xd4b3a283178fe3d5deb067a99d77fd4cf150daf4` (P2P NFT resale)
  - `Governance` (scaffold): Proposal creation, weighted voting, execution
  - `MilestoneEscrow` (scaffold): Milestone-based fund release with HCS verification

**Use Cases**:
- **Property NFT Registry**: Mint and manage property NFTs with IPFS metadata URIs
- **Booking Marketplace**: List, buy, and transfer booking NFTs with expiry guards
- **Governance**: Delegated voting on project proposals using HBAR-staked weight
- **Escrow**: Release funds only when HCS-logged milestones are verified

**Transaction Types:**
- `ContractCall`: Interact with smart contracts (gas-based, ~$0.05)
- `ContractExecute`: Deploy new contracts (gas-based, ~$1-5)

**Economic Justification**: Hedera EVM fees are 100x cheaper than Ethereum, enabling complex governance and escrow logic without prohibitive costs. A full governance proposal cycle costs ~$0.50 vs. ~$50 on Ethereum.

---

## 🚀 Deployment & Setup

### Prerequisites

- **Node.js**: v16+ (v18+ recommended)
- **npm**: v8+ (comes with Node.js)
- **MetaMask**: Browser extension installed
- **Git**: For cloning the repository

### Step-by-Step Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/thustlerwizzle/afrogold.git
cd afrogold
```

#### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies (optional, for GitHub OAuth)
cd backend
npm install
cd ..
```

#### 3. Configure Environment Variables

**Frontend Configuration** (`/.env`):

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# GitHub OAuth (optional)
REACT_APP_GITHUB_CLIENT_ID=your_github_client_id
REACT_APP_GITHUB_REDIRECT_URI=http://localhost:3000/auth/github/callback
REACT_APP_GITHUB_AUTH_PROXY=http://localhost:3001

# Hedera Testnet RPC (optional, defaults to public)
REACT_APP_HEDERA_TESTNET_RPC=https://testnet.hashio.io/api
```

**Backend Configuration** (`/backend/.env`) - Only if using GitHub OAuth:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
PORT=3001
FRONTEND_URL=http://localhost:3000
```

#### 4. Run the Application

**Frontend (Development Mode):**

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

**Backend (Optional, for GitHub OAuth):**

```bash
# From root directory
npm run backend

# Or from backend directory
cd backend
node server.js
```

Backend runs at [http://localhost:3001](http://localhost:3001)

#### 5. Connect MetaMask to Hedera Testnet

The app will automatically prompt you to add Hedera Testnet if not already configured:
- **Chain ID**: `296` (0x128)
- **RPC URL**: `https://testnet.hashio.io/api`
- **Currency Symbol**: `HBAR`
- **Block Explorer**: `https://hashscan.io/testnet`

Alternatively, the app will automatically switch your MetaMask to Hedera Testnet on connection.

#### 6. Expected Local Running State

- **Frontend**: [http://localhost:3000](http://localhost:3000) (React development server)
- **Backend**: [http://localhost:3001](http://localhost:3001) (Express server, optional)
- **MetaMask**: Connected to Hedera Testnet (Chain ID: 296)
- **Hot Reload**: Enabled (changes auto-refresh in browser)

---

## 🏗️ Architecture

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         React Frontend (localhost:3000)                  │   │
│  │  • Property Listings  • Booking System  • NFT Viewer    │   │
│  │  • Project Investment • Supplier Dashboard             │   │
│  └───────────────┬──────────────────────────────────────────┘   │
│                  │ MetaMask (EVM)                               │
└──────────────────┼───────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Hedera Testnet (EVM)                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          Smart Contracts (Solidity)                       │  │
│  │  • PropertyNFTRegistry (0xb1F616...)                     │  │
│  │  • BookingMarketplace (0xd4b3a2...)                      │  │
│  │  • Governance.sol (scaffold)                              │  │
│  │  • MilestoneEscrow.sol (scaffold)                        │  │
│  └───────────────────────┬───────────────────────────────────┘  │
└──────────────────────────┼───────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Hedera Network Services                       │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────┐ │
│  │  Hedera Token    │  │  Hedera Consensus │  │  Mirror     │ │
│  │  Service (HTS)   │  │  Service (HCS)    │  │  Nodes      │ │
│  │                  │  │                  │  │             │ │
│  │  Token ID:       │  │  Topic IDs:      │  │  HashScan   │ │
│  │  0.0.7118319     │  │  Per Project     │  │  Explorer   │ │
│  │                  │  │                  │  │             │ │
│  │  • Mint NFTs    │  │  • Log Events    │  │  • Query    │ │
│  │  • Transfer     │  │  • Verify Proofs │  │  • Monitor  │ │
│  └──────────────────┘  └──────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Local Storage (Browser)                     │
│  • Properties (localStorage)                                    │
│  • Bookings (localStorage)                                      │
│  • NFT Mappings (localStorage)                                  │
│  • Chat Messages (localStorage + BroadcastChannel)             │
└─────────────────────────────────────────────────────────────────┘
```

### Component Architecture

```
Frontend (React + TypeScript)
├── Wallet Integration (MetaMask)
│   └── src/wallet/metamask.ts
├── Smart Contract Interaction (ethers.js)
│   └── src/utils/eth.ts, src/utils/nft.ts, src/utils/market.ts
├── HTS Integration
│   └── src/utils/hts.ts
├── Components
│   ├── PropertyCard, PropertyList
│   ├── BookingSystem
│   ├── NFTViewer (with Marketplace)
│   ├── ProjectInvestment
│   ├── Suppliers
│   └── HostDashboard
└── Data Management
    ├── localStorage (client-side persistence)
    └── BroadcastChannel (real-time sync across tabs)

Backend (Optional - Express)
└── GitHub OAuth Token Exchange
    └── backend/server.js

Smart Contracts (Hardhat)
├── contracts/property/PropertyNFTRegistry.sol
├── contracts/market/BookingMarketplace.sol
├── contracts/governance/Governance.sol
└── contracts/escrow/MilestoneEscrow.sol
```

---

## 🔑 Key IDs & Security

### Hedera Testnet Deployment IDs

**Hedera Token Service (HTS):**
- **Token ID**: `0.0.7118319` (Hotel Booking NFT Collection)
- **Token Name**: "Hotel Booking NFT"
- **Treasury Account**: `0.0.7054981`
- **First Serial**: Serial #1 (minted on Oct 23, 2025)

**Smart Contracts (EVM):**
- **ERC721Token Contract**: 
  - Contract ID: `0.0.5816542`
  - EVM Address: `0xb1F616b8134F602c3Bb465fB5b5e6565cCAd37Ed`
  - Network: Hedera Testnet
- **PropertyNFTRegistry**: `0xb1F616b8134F602c3Bb465fB5b5e6565cCAd37Ed` (default)
- **BookingMarketplace**: `0xd4b3a283178fe3d5deb067a99d77fd4cf150daf4` (default)

**Hedera Account IDs:**
- Default Receiver (for testing): `0.0.7054981` (EVM: `0xd4b3a283178fe3d5deb067a99d77fd4cf150daf4`)

### Security Practices

✅ **Do NOT commit:**
- Private keys
- `.env` files
- `backend/.env` files
- Wallet mnemonics
- API secrets

✅ **Safe to commit:**
- `.env.example` files (template only)
- Contract addresses (public on testnet)
- Token IDs (public identifiers)

### Environment Variables Template

See `.env.example` and `backend/.env.example` for the structure of required variables. These files are safe to commit and serve as templates.

---

## 👨‍⚖️ Judge Credentials

### Test Account Access

To test the application as a judge, you can:

1. **Use Your Own MetaMask Wallet:**
   - Install MetaMask browser extension
   - Create or import a test account
   - Connect MetaMask to Hedera Testnet (the app will auto-prompt)
   - Get test HBAR from the [Hedera Testnet Faucet](https://portal.hedera.com/faucet)

2. **Default Test Wallet (if provided in DoraHacks submission notes):**
   - Test Account ID: See submission notes
   - Private Key: See submission notes (for direct Hedera SDK access, not required for MetaMask)

### Quick Test Checklist

1. ✅ Connect MetaMask to Hedera Testnet
2. ✅ Browse properties on the guest dashboard
3. ✅ Make a test booking (requires HBAR)
4. ✅ View NFTs in the "My NFTs" tab
5. ✅ Switch to Host mode and list a property
6. ✅ Check HashScan links on property/project cards

### Common Issues & Solutions

**MetaMask not connecting:**
- Ensure MetaMask extension is enabled
- Try refreshing the page
- Check browser console for errors

**Transactions failing:**
- Ensure you have test HBAR (get from faucet)
- Verify MetaMask is on Hedera Testnet (Chain ID: 296)
- Check transaction in HashScan explorer

**NFTs not showing:**
- Click "Mint Missing NFTs" in Host Dashboard (if logged in as host)
- Check browser console for minting errors
- Verify contract addresses in `src/config/contracts.ts`

---

## 💻 Code Quality

### Code Standards

- **TypeScript**: Strict mode enabled (`tsconfig.json`)
- **React**: Functional components with hooks
- **ESLint**: Configured for React/TypeScript (warnings shown in console)
- **Code Style**: Consistent naming conventions:
  - Components: PascalCase (`PropertyCard.tsx`)
  - Utilities: camelCase (`mintPropertyNft.ts`)
  - Types: PascalCase with `I` prefix for interfaces (`IProperty.ts`)

### Project Structure

```
afrogold/
├── src/
│   ├── components/       # React UI components
│   ├── config/          # Configuration files (contracts, Hedera)
│   ├── data/           # Static data (properties, projects)
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions (NFT, HTS, market)
│   └── wallet/         # MetaMask integration
├── contracts/          # Solidity smart contracts (Hardhat)
│   ├── governance/
│   ├── escrow/
│   ├── property/
│   └── market/
├── backend/            # Express server (GitHub OAuth)
└── public/             # Static assets
```

### Linting & Formatting

```bash
# Check for linting errors
npm run lint

# Type checking
npx tsc --noEmit
```

### Commit History

We maintain clear commit messages:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation updates
- `refactor:` Code refactoring
- `test:` Test additions

Example: `feat: Add NFT marketplace buy functionality`

### Testing

- Unit tests: `src/**/*.test.tsx` (Jest + React Testing Library)
- Smart contract tests: `contracts/test/**/*.test.ts` (Hardhat)
- Manual testing: Full user flows tested on Hedera Testnet

### Documentation

- Inline comments for complex logic
- Type definitions for all functions
- README.md with setup instructions
- Contract documentation in `contracts/README.md`

---

## 📞 Support & Contact

- **Project Repository**: [https://github.com/thustlerwizzle/afrogold](https://github.com/thustlerwizzle/afrogold)
- **Live Demo**: [https://afrogold-app.netlify.app/](https://afrogold-app.netlify.app/)
- **Issues**: Please open a GitHub issue for bugs or feature requests

---

## 📜 License

This project is submitted for the Hedera Africa Hackathon 2025. All rights reserved.

---

**Built with ❤️ for Africa's transparent infrastructure future**
