# Base GM Roll

Base GM Roll is a minimal onchain GM counter Mini App for Base.

Users connect a wallet, press **Say GM**, and the app calls `sayGM()` on the `BaseGMRoll` contract. The app reads `userGMs(address)` and `totalGMs()` directly from the contract and shows wallet status plus the latest transaction state.

No token purchase, rewards, points, invite system, leaderboard, fees, or paid actions are included. Users only pay Base gas for their own transaction.

## Stack

- Next.js
- TypeScript
- App Router
- Wagmi
- Viem
- Tailwind CSS

## Environment

Copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_BASE_GM_ROLL_ADDRESS=0x...
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
```

The first deployment should leave the builder code empty in `lib/wagmi.ts`. After base.dev verification, set `builderCode` in `lib/wagmi.ts` to the issued code and redeploy. The app generates the ERC-8021 encoded `dataSuffix` with `ox/erc8021`, adds it to Wagmi config, and explicitly passes it to every `writeContract` call.

## Base Offchain Attribution

`app/layout.tsx` hardcodes:

```html
<meta name="base:app_id" content="[填写 base.dev Verify token]" />
```

Replace the content value with the real base.dev verification token before verification.

## Commands

```bash
npm install
npm run dev
npm run build
```

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

## Deployment Checklist

1. Deploy the contract on Base.
2. Set `NEXT_PUBLIC_BASE_GM_ROLL_ADDRESS` and `NEXT_PUBLIC_BASE_RPC_URL`.
3. Replace the hardcoded `base:app_id` meta content in `app/layout.tsx`.
4. Deploy to Vercel with deployment protection disabled.
5. Verify offchain attribution in base.dev.
6. Add the issued builder code to `lib/wagmi.ts`.
7. Redeploy and verify onchain attribution by checking the transaction input suffix on Basescan and base.dev.
