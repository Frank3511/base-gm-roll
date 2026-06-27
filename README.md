# BaseGMRoll

Repository: https://github.com/Frank3511/base-gm-roll.git

BaseGMRoll is a minimal onchain GM counter Mini App for Base.

Users connect a wallet, press **Say GM**, and the app calls `sayGM()` on the `BaseGMRoll` contract.

The app reads `userGMs(address)` and `totalGMs()` directly from the contract.

It also displays wallet connection status and the latest transaction state.

There are no purchases, rewards, points, invite systems, leaderboards, fees, or paid actions included.

Users only pay Base gas for their own transaction.

## Features

- Connect a wallet on Base.
- Press **Say GM** to submit an onchain GM.
- Read the connected wallet's GM count from `userGMs(address)`.
- Read the global GM count from `totalGMs()`.
- Display transaction progress and result state.
- Keep the app intentionally simple and contract-driven.

## Stack

- Next.js
- TypeScript
- App Router
- Wagmi
- Viem
- Tailwind CSS

## Getting Started

Clone the repository:

```bash
git clone https://github.com/Frank3511/base-gm-roll.git
cd base-gm-roll
```

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
