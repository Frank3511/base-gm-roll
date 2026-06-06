# Base GM Roll

Base GM Roll is an onchain GM counter Mini App for Base. Users connect a wallet, press **Say GM**, and the app calls `sayGM()` on the `BaseGMRoll` contract. The UI reads `userGMs(address)` and `totalGMs()` directly from the contract.

## Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BaseGMRoll {
    mapping(address => uint256) public userGMs;
    uint256 public totalGMs;

    event GMSent(address indexed user, uint256 userGMs, uint256 totalGMs);

    function sayGM() external {
        unchecked {
            userGMs[msg.sender] += 1;
            totalGMs += 1;
        }

        emit GMSent(msg.sender, userGMs[msg.sender], totalGMs);
    }
}
```

## Environment

Copy `.env.example` to `.env.local` and set:

```bash
VITE_BASE_GM_ROLL_ADDRESS=0x...
VITE_BASE_RPC_URL=https://mainnet.base.org
VITE_BASE_BUILDER_CODE=...
```

`VITE_BASE_BUILDER_CODE` is appended to `sayGM()` calldata using ERC-8021 attribution via `ox/erc8021`. Use the Builder Code from base.dev before production.

## Commands

```bash
npm install
npm run dev
npm run build
```

## Deployment Checklist

1. Deploy `BaseGMRoll` on Base mainnet.
2. Set `VITE_BASE_GM_ROLL_ADDRESS`, `VITE_BASE_RPC_URL`, and `VITE_BASE_BUILDER_CODE` in Vercel.
3. Update `public/.well-known/farcaster.json` URLs to the final Vercel domain.
4. Fill `accountAssociation` with the signed Mini App manifest values.
5. Deploy on Vercel.
6. Verify the app attribution on base.dev using the same Builder Code.
