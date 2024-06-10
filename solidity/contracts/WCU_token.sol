// We will be using ERC20 standard since the token is fungible.
pragma solidity ^0.8.17;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract WCUToken is ERC20, Ownable {
    // Initial supply minted to the deployer's address
    constructor(uint256 initialSupply) ERC20("Woodland Carbon Unit", "WCU") {
        _mint(msg.sender, initialSupply);
    }

    // Mint new supply of WCU to a specific amount. Only the contract owner is able to do so, in theory after certifying a carbon offset.
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}