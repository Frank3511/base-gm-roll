# BaseGMRoll

Repository: https://github.com/Frank3511/base-gm-roll.git

BaseGMRoll is a minimal onchain GM counter Mini App for Base.

Users connect a wallet, press **Say GM**, and the app calls `sayGM()` on the `BaseGMRoll` contract. The app reads each wallet's GM count from `userGMs(address)` and the global GM count from `totalGMs()`.

The project is intentionally simple and contract-driven. It does not include purchases, rewards, points, invite systems, leaderboards, fees, or paid actions. Users only pay Base gas for their own transaction.

## Overview

BaseGMRoll provides a lightweight interface for sending a GM onchain.

The main flow is:

1. Connect a wallet on Base.
2. Press **Say GM**.
3. Confirm the transaction in the connected wallet.
4. Wait for the transaction state to update.
5. View the connected wallet's GM count and the global GM count.

The app also displays wallet connection status and the latest transaction state so users can understand what is happening during the interaction.

## Features

- Connect a wallet on Base.
- Submit an onchain GM by calling `sayGM()`.
- Read the connected wallet's GM count from `userGMs(address)`.
- Read the global GM count from `totalGMs()`.
- Display wallet connection status.
- Display transaction progress and result state.
- Keep the app intentionally simple and focused on the contract.

## Tech Stack

- Next.js
- TypeScript
- App Router
- Wagmi
- Viem
- Tailwind CSS

## Repository

```bash
git clone https://github.com/Frank3511/base-gm-roll.git
cd base-gm-roll
```

## Getting Started

Install the project dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Set the required environment variables in `.env.local`:

```bash
NEXT_PUBLIC_BASE_GM_ROLL_ADDRESS=0x...
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
```

Replace `0x...` with the deployed `BaseGMRoll` contract address.

## Development

Start the local development server:

```bash
npm run dev
```

Then open the local Next.js development URL in your browser.

Make sure your wallet is connected to Base before using the app. If the wallet is connected to a different network, switch to Base before submitting a GM transaction.

## Build

Create a production build:
