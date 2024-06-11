// We will be using ERC20 standard since the token is fungible.
pragma solidity ^0.8.17;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

// Interface for the ERC20 token
interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

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

contract ETHtoWCUExchange is Ownable {
    address payable public buyer;
    address payable public seller;
    IERC20 public wcuToken;
    uint256 public rate; // Price in ETH of 1 WCU token

    constructor(address _wcuTokenAddress, address payable _seller, uint256 _rate) {
        buyer = payable(msg.sender);
        seller = _seller;
        wcuToken = IERC20(_wcuTokenAddress);
        rate = _rate;
    }

    event TokensPurchased(address buyer, uint256 amountETH, uint256 amountWCU);

    function buyWCUTokens(uint256 amountWCU) public payable {
        uint256 amountETH = amountWCU * rate;
        require(address(this).balance >= amountETH, "Not enough ETH to purchase WCU");
        seller.transfer(amountETH);
        wcuToken.transfer(buyer, amountWCU);
        emit TokensPurchased(msg.sender, amountETH, amountWCU);
    }

    // function withdrawETH() public onlyOwner {
    //     payable(owner).transfer(address(this).balance);
    // }

    // function withdrawTokens() public onlyOwner {
    //     uint256 contractBalance = wcuToken.balanceOf(address(this));
    //     wcuToken.transfer(owner, contractBalance);
    // }

    function setRate(uint256 newRate) public onlyOwner {
        rate = newRate;
    }

    function getRate() public view returns (uint256 x) {
        return rate;
    }
}