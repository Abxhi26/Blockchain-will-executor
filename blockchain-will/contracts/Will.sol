// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Will {
    address public owner;
    address public beneficiary;
    uint256 public inheritance;
    bool public isDeceased;

    constructor(address _beneficiary) payable {
        owner = msg.sender;
        beneficiary = _beneficiary;
        inheritance = msg.value;
        isDeceased = false;
    }

    function deposit() public payable {
        require(msg.sender == owner, "Only owner can deposit");
        inheritance += msg.value;
    }

    function declareDeceased() public {
        require(msg.sender == owner, "Only owner can declare deceased");
        require(!isDeceased, "Already declared deceased");
        isDeceased = true;
        payable(beneficiary).transfer(inheritance);
    }

    receive() external payable {}
}
