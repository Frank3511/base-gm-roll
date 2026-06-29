# BaseGMRoll

Repository: https://github.com/Frank3511/base-gm-roll.git

BaseGMRoll is a minimal onchain GM counter Mini App for Base.

Users connect a wallet, press **Say GM**, and the app calls `sayGM()` on the `BaseGMRoll` contract. The app reads each wallet's GM count from `userGMs(address)` and the global GM count from `totalGMs()`.

The project is intentionally simple and contract-driven. It does not include purchases, rewards, points, invite systems, leaderboards, fees, or paid actions. Users only pay Base gas for their own transaction.
