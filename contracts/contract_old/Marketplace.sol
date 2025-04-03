// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;
import "./Escrow.sol";


contract Marketplace {
    /* ProductStatus[0] == open, ProductStatus[1] == sold etc.. */
    enum ProductStatus { Open, Sold, Unsold }
    enum ProductCondition { New, Used }

    uint public productIndex;

    /* every product can have an address to an escrow contract to store a final bid */
    mapping (uint => address) public productEscrow;

    /* every address can have there own store with listed products, of which every product is a product struct*/
    /* user adds first product: 0x64fcba11d3dce1e3f781e22ec2b61001d2c652e5 => {1 => "struct with iphone details"} */
    mapping (address => mapping(uint => Product)) public stores;

    /* which products are in whose store */
    mapping (uint => address) public productIdInStore;

    /* contract constructor */
    constructor()  {
        productIndex = 0;
    }

    /* event to which the server can listen and then copy the data to mongo when a new product is added */
    event NewProduct(uint _productId, string _name, string _category, string _imageLink, string _descLink,
        uint _startPrice, uint _productCondition);

    event NewBid(address _bidder, uint _productId, uint _amount);

    struct Product {
        uint id;
        string name;
        string category;
        string imageLink;
        string descLink;
        uint startPrice;
        address highestBidder;
        uint highestBid;
        uint totalBids;
        ProductStatus status;
        ProductCondition condition;
        mapping (address => Bid) bids;
    }



    /* add new product */
    function addProduct(string memory _name, string memory _category, string memory _imageLink, string memory _descLink, uint _startPrice,
        uint _productCondition) public {

        productIndex += 1;

        /* create new product with arguments as input */
        Product storage product = stores[msg.sender][productIndex];
        product.id=productIndex;
        product.name = _name;
        product.category = _category;
        product.imageLink = _imageLink;
        product.descLink = _descLink;
        product.startPrice = _startPrice;
        product.status = ProductStatus.Open;
        product.condition = ProductCondition(_productCondition);
        

        /* productIndex->address */
        productIdInStore[productIndex] = msg.sender;

        /* trigger event to let the front-end know that a new product has been added */
        emit NewProduct(productIndex, _name, _category, _imageLink, _descLink, _startPrice, _productCondition);
    }

    function getProduct(uint _productId) public view returns (uint, string memory, string memory, string memory, string memory, uint,
        ProductStatus, ProductCondition, uint, uint) {

        /* fist get address with productnumber, then get the product with that address and id */
        Product storage product = stores[productIdInStore[_productId]][_productId];

        return (product.id, product.name, product.category, product.imageLink, product.descLink,
        product.startPrice, product.status, product.condition, product.totalBids, product.highestBid);
    }

    struct Bid {
        address bidder;
        uint productId;
        uint amount;
    }

    /* bid on a product */
    function bid(uint _productId, uint _amount) public payable returns (bool) {
        Product storage product = stores[productIdInStore[_productId]][_productId];

        
       require(product.bids[msg.sender].bidder == address(0));


        if (_amount > product.highestBid) {
            product.highestBid = _amount;
            product.highestBidder = msg.sender;
        }

        product.bids[msg.sender] = Bid(msg.sender, _productId, _amount);

        product.totalBids += 1;

        emit NewBid(msg.sender, _productId, _amount);

        return true;
    }

    /* see who is the current hightest bidder with the highest bid */
    function highestBidderInfo(uint _productId) public view returns (address, uint) {
        Product storage product = stores[productIdInStore[_productId]][_productId];
        return (product.highestBidder, product.highestBid);
    }

    /* return the total number of bids on a product */
    function totalBids(uint _productId) public view returns (uint) {
        Product storage product = stores[productIdInStore[_productId]][_productId];
        return product.totalBids;
    }

    /* close the auction */
    function closeAuction(uint _productId) public {
        Product storage product = stores[productIdInStore[_productId]][_productId];

        require(productIdInStore[_productId] == msg.sender);
        require(product.status == ProductStatus.Open);

        if (product.totalBids == 0) {
            product.status = ProductStatus.Unsold;
        } else {
            product.status = ProductStatus.Sold;

        }
    }

    /* if you are the buyer and highestbidder and the contract has been closed, you send the money to the escrow */
    function sendToEscrow(uint _productId) public payable {
        Product storage product = stores[productIdInStore[_productId]][_productId];

        address seller = productIdInStore[_productId];


        require(product.highestBidder == msg.sender);
        require(product.status == ProductStatus.Sold);

        Escrow escrow = (new Escrow){value:msg.value}(_productId, msg.sender, seller);
        productEscrow[_productId] = address(escrow);
    }

    /* get the escrow contract address for a product */
    function escrowAddresForProduct(uint _productId) public view returns (address) {
        return productEscrow[_productId];
    }

    /* get all the info on the escrow contract (buyer, seller, fundsDisbursed yes/no) */
    function escrowInfo(uint _productId) public view returns (address, address, bool) {
        return Escrow(productEscrow[_productId]).escrowInfo();
    }

    /* give the funds in the escrow contract to the seller */
    function releaseToSeller(uint _productId) public {
        Escrow(productEscrow[_productId]).releaseToSeller();
    }

    /* refund the funds in the escrow contract to the buyer */
    function refundToBuyer(uint _productId) public {
        Escrow(productEscrow[_productId]).refundToBuyer();
    }
}