// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DeKToken is ERC20 {
    address public owner;

    constructor(uint256 initialSupply) ERC20("DeK Token", "DeK") {
        owner = msg.sender;
        _mint(msg.sender, initialSupply); // Mint initial supply to the deployer
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == owner, "Only the owner can mint tokens");
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external {
        require(msg.sender == owner, "Only the owner can burn tokens");
        _burn(from, amount);
    }
}
