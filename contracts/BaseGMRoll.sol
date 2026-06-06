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
