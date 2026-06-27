# BaseGMRoll

Repository: https://github.com/Frank3511/base-gm-roll.git

BaseGMRoll is a minimal onchain GM counter Mini App for Base.

Users connect a wallet, press **Say GM**, and the app calls `sayGM()` on the `BaseGMRoll` contract.

The app reads `userGMs(address)` and `totalGMs()` directly from the contract.

It also displays wallet connection status and the latest transaction state.

There are no purchases, rewards, points, invite systems, leaderboards, fees, or paid actions included.

Users only pay Base gas for their own transaction.

## Features
