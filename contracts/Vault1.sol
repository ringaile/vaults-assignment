//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vault1 {

    uint256 amount;
    address public owner;
    IERC20 token;

    event Deposited(address indexed user, address tokenAddress, uint256 amount);
    event Withdrawn(address indexed user, address tokenAddress, uint256 amount);

    constructor(IERC20 _token) {
        owner = msg.sender;
        token = _token;
    }

    function deposit(uint256 _amount) public {
        token.transferFrom(msg.sender, address(this), _amount);
        emit Deposited(msg.sender, address(token), _amount);

    }
    
    function withdraw(uint256 _amount) public {
        require(_amount <= amount, "Contract balance is too low");
        token.approve(msg.sender, _amount);
        require(token.transfer(msg.sender, _amount));
        emit Withdrawn(msg.sender, address(token), _amount);
    }
}
