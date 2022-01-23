//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20TestToken is ERC20{

    constructor() ERC20("Test Token", "TST") {
        _mint(msg.sender, 10000000000000);
    }

}