// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "./DeKToken.sol";  // Import DeKToken

contract Escrow {
    uint public productId;
    address public buyer;
    address public seller;
    uint public ethAmount;
    uint public dekAmount;
    DeKToken public deKToken;
    bool public fundsDisbursed;

    /* Constructor that creates the escrow contract */
    constructor(uint _productId, address _buyer, address _seller, DeKToken _deKToken) payable {
        productId = _productId;
        buyer = _buyer;
        seller = _seller;
        ethAmount = msg.value;
        deKToken = _deKToken;
        dekAmount = 0;
        fundsDisbursed = false;
    }

    /* Function to deposit DeK tokens into the escrow contract */
    function depositDeK(uint _amount) public {
        // require(msg.sender == buyer, "Only buyer can deposit DeK");
        require(!fundsDisbursed, "Funds already disbursed");
        require(deKToken.transferFrom(buyer, address(this), _amount), "DeK token transfer failed");

        dekAmount += _amount;
    }

    /* Function to release funds (ETH + DeK) to the seller */
    function releaseToSeller() public {
        // require(msg.sender == buyer || msg.sender == seller, "Only buyer or seller can release funds");
        require(!fundsDisbursed, "Funds already disbursed");

        // Transfer ETH to the seller
        payable(seller).transfer(ethAmount);

        // Transfer DeK tokens to the seller
        if (dekAmount > 0) {
            require(deKToken.transfer(seller, dekAmount), "DeK token transfer failed");
        }

        fundsDisbursed = true;
    }

    /* Function to refund the buyer if the transaction is not completed */
    function refundToBuyer() public {
        require(msg.sender == seller, "Only seller can refund");
        require(!fundsDisbursed, "Funds already disbursed");

        // Refund ETH to the buyer
        payable(buyer).transfer(ethAmount);

        // Refund DeK tokens to the buyer
        if (dekAmount > 0) {
            require(deKToken.transfer(buyer, dekAmount), "DeK token refund failed");
        }

        fundsDisbursed = true;
    }

    /* Function to get escrow info */
    function escrowInfo() public view returns (address, address, uint, uint, bool) {
        return (buyer, seller, ethAmount, dekAmount, fundsDisbursed);
    }
}
