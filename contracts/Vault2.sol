//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault2 is ERC20{

    constructor() ERC20("Wrapped Vault", "WVT"){}

    function mint(uint256 _amount) external payable {
        require(_amount >= 0, "No amount given");
        require(_amount == msg.value, "Amount must be the same as ETH value");
        _mint(msg.sender, _amount);
    }
    
    function burn(uint256 _amount) external payable {
        require(_amount > 0, "No amount given");
        _burn(msg.sender, _amount);
        (bool sent,) = msg.sender.call{value: _amount}("");
        require(sent, "Failed to send ETH");
    }
    
}
