// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "./DeKToken.sol"; // Import DeK token contract
import "./Escrow.sol";   // Import Escrow contract

contract Marketplace {
    DeKToken public deKToken;
    address public owner;

    enum ProductStatus {
        Open,
        Pending,
        Sold,
        Unsold,
        Closed
    }

    enum ProductCondition {
        New,
        Used
    }

    uint256 public productIndex;

    mapping(uint256 => address) public productEscrow;
    mapping(address => mapping(uint256 => Product)) public stores;
    mapping(uint256 => address) public productIdInStore;

    constructor(address _deKTokenAddress) {
        productIndex = 0;
        owner = msg.sender;
        deKToken = DeKToken(_deKTokenAddress);
    }

    event NewProduct(
        uint256 _productId,
        string _name,
        string _category,
        uint256 _startPrice,
        uint256 _productCondition
    );

    event NewBid(address _bidder, uint256 _productId, uint256 _amount);
    event ProductAdded(uint256 productId, string name, uint256 price);
    event ProductPurchased(uint256 productId, address buyer, uint256 ethPaid, uint256 dekPaid);

    struct Product {
        uint256 id;
        string name;
        string category;
        uint256 startPrice;
        address highestBidder;
        uint256 highestBid;
        uint256 totalBids;
        ProductStatus status;
        ProductCondition condition;
        mapping(address => Bid) bids;
    }

    struct Bid {
        address bidder;
        uint256 productId;
        uint256 amount;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    // Add new product
    function addProduct(
        string memory _name,
        string memory _category,
        uint256 _startPrice,
        uint256 _productCondition
    ) public {
        productIndex += 1;
        Product storage product = stores[msg.sender][productIndex];
        product.id = productIndex;
        product.name = _name;
        product.category = _category;
        product.startPrice = _startPrice;
        product.status = ProductStatus.Open;
        product.condition = ProductCondition(_productCondition);

        productIdInStore[productIndex] = msg.sender;

        emit NewProduct(
            productIndex,
            _name,
            _category,
            _startPrice,
            _productCondition
        );
    }

    // Create product
    function createProduct(string memory _name, string memory _category, uint256 _price) external {
        uint256 productId = uint256(keccak256(abi.encodePacked(_name, _category, msg.sender, block.timestamp)));
        Product storage product = stores[msg.sender][productId];
        product.id = productId;
        product.name = _name;
        product.category = _category;
        product.startPrice = _price;
        product.status = ProductStatus.Open;
        productIdInStore[productId] = msg.sender;

        emit ProductAdded(productId, _name, _price);
    }

    // Bid on a product
    function bid(uint256 _productId, uint256 _amount) public {
        Product storage product = stores[productIdInStore[_productId]][_productId];
        require(product.status == ProductStatus.Open, "Bidding is not allowed on this product");
        require(msg.sender != productIdInStore[_productId], "Seller cannot bid on their own product");
        require(_amount > product.highestBid, "Bid amount must be higher than the current highest bid");

        product.bids[msg.sender] = Bid({
            bidder: msg.sender,
            productId: _productId,
            amount: _amount
        });

        product.highestBid = _amount;
        product.highestBidder = msg.sender;
        product.totalBids += 1;

        emit NewBid(msg.sender, _productId, _amount);
    }

    // Get highest bidder info
    function highestBidderInfo(uint256 _productId) public view returns (address, uint256) {
        Product storage product = stores[productIdInStore[_productId]][_productId];
        return (product.highestBidder, product.highestBid);
    }

    // Get total bids on a product
    function totalBids(uint256 _productId) public view returns (uint256) {
        Product storage product = stores[productIdInStore[_productId]][_productId];
        return product.totalBids;
    }

    // Close auction
    function closeAuction(uint256 _productId) public {
        Product storage product = stores[productIdInStore[_productId]][_productId];
        require(productIdInStore[_productId] == msg.sender, "Only the seller can close the auction");
        require(product.status == ProductStatus.Open, "Auction is not open");

        if (product.totalBids == 0) {
            product.status = ProductStatus.Unsold;
        } else {
            product.status = ProductStatus.Closed;
        }
    }

    // Purchase product
    function buyProduct(uint256 _productId, uint256 _dekAmount) public payable {
    Product storage product = stores[productIdInStore[_productId]][_productId];
    require(product.status == ProductStatus.Open, "Product not available");
    require(msg.sender != productIdInStore[_productId], "Seller cannot buy their own product");

    uint256 dekValueInEth = _dekAmount / 10; // 10 DeK = 1 ETH
    uint256 totalEthPaid = msg.value + dekValueInEth;

    require(totalEthPaid >= product.startPrice, "Insufficient funds");

    // Transfer DeK tokens directly from the buyer to the contract
    if (_dekAmount > 0) {
        require(deKToken.transferFrom(msg.sender, address(this), _dekAmount), "DeK token transfer failed");
    }

    // Create the escrow contract with the ETH value and DeK token
    Escrow escrow = (new Escrow){value: msg.value}(_productId, msg.sender, productIdInStore[_productId], deKToken);
    productEscrow[_productId] = address(escrow);

    if (_dekAmount > 0) {
        escrow.depositDeK(_dekAmount);
    }

    // Mark the product as pending
    product.status = ProductStatus.Pending;
    emit ProductPurchased(_productId, msg.sender, msg.value, _dekAmount);
}

    // Release funds to the seller
    function releaseToSeller(uint256 _productId) public {
        require(msg.sender == stores[productIdInStore[_productId]][_productId].highestBidder, "Only the highest bidder can release funds");
        Escrow(productEscrow[_productId]).releaseToSeller();
        Product storage product = stores[productIdInStore[_productId]][_productId];
        product.status = ProductStatus.Sold;
    }

    // Refund funds to the buyer
    function refundToBuyer(uint256 _productId) public {
        require(msg.sender == productIdInStore[_productId], "Only the seller can initiate a refund");
        Escrow(productEscrow[_productId]).refundToBuyer();
        Product storage product = stores[productIdInStore[_productId]][_productId];
        product.status = ProductStatus.Open;
    }

    // Get product info
    function getProduct(uint256 _productId)
        public
        view
        returns (
            string memory,
            string memory,
            uint256,
            address,
            ProductStatus
        )
    {
        Product storage product = stores[productIdInStore[_productId]][_productId];
        return (
            product.name,
            product.category,
            product.startPrice,
            productIdInStore[_productId],
            product.status
        );
    }

    // Get escrow info
    function getEscrowInfo(uint256 _productId)
        public
        view
        returns (
            address,
            address,
            uint256,
            uint256,
            bool
        )
    {
        Escrow escrow = Escrow(productEscrow[_productId]);
        return escrow.escrowInfo();
    }
}
