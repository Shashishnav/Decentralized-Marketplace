// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;


contract Escrow {
    uint public productId;
    address public buyer;
    address public seller;
    uint public amount;
    bool public fundsDisbursed;

    /* constructor that creates the escrow contract */
    constructor(uint _productId, address _buyer, address _seller) payable {
        productId = _productId;
        buyer = _buyer;
        seller = _seller;
        amount = msg.value;
        fundsDisbursed = false;
    }

    /* get info on the escrow that's created */
    function escrowInfo() public view returns (address, address, bool) {
        return (buyer, seller, fundsDisbursed);
    }

    /* if buyer approves, release funds  */
    function releaseToSeller() public returns (bool) {
        require(!fundsDisbursed);
        /* require(caller == buyer); */
       require(address(this).balance >= amount);


       payable(seller).transfer(amount);

        fundsDisbursed = true;

        return true;
    }

    /* if the sale is not approved the funds get refunded to buyer */
    function refundToBuyer() public returns (bool) {
        require(!fundsDisbursed);
        /* require(caller == seller); */
        require(address(this).balance >= amount);

        payable(buyer).transfer(amount);
        fundsDisbursed = true;

        return true;
    }
}