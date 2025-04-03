const dash =require('./dashModel')

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const BidSchema = new Schema({
    amount: Number,
    bidder: String
})

const ProductSchema = new Schema({
    blockchainId: String,
    uname: String,
    des: String,
    category: String,
    img: String,
    price: String,
    phone:String,
    city:String,
    address:String,
    state:String,
    email:String,
    pincode:String,
    condition: String,
    bids: [BidSchema],
    productStatus: Number // 0 = open 1 = pending 2 = closed
},{timestamps:true})

ProductSchema.statics.list = async function(blockchainId,uname,des,category,img,price,phone,city,address,state,email,pincode,condition,account){

    const item = await this.create({blockchainId,uname,des,category,img,price,phone,city,address,state,email,pincode,condition,bids:[],productStatus:0})
    await dash.updateDash(account,{blockchainId:blockchainId,uname:uname,des:des,category:category,price:price},"listing")

    return item
}

ProductSchema.statics.allprods=async function(){
    const prods = await this.find({ productStatus: { $eq: 0 } });
    return prods
}
ProductSchema.statics.getprod=async function(blockchainId){
  const prod =await this.findOne({blockchainId})
  return prod
}

ProductSchema.statics.makebid=async function(blockchainId,bid){
    const filter ={ blockchainId: blockchainId }
    const update ={ $push: { bids: bid }}
    const bidRes = await this.findOneAndUpdate(filter, update, { new: true });
    await dash.updateDash(bid.bidder,{blockchainId:blockchainId,uname:bidRes.uname,des:bidRes.des,category:bidRes.category,price:bid.amount},"bids")
    return bidRes
}

ProductSchema.statics.updatebid = async function (blockchainId, bid) {
    const filter = { blockchainId: blockchainId };
    const update = {
      $set: {
        "bids.$[elem].amount": bid.amount,
      },
    };
    const options = {
      arrayFilters: [{ "elem.bidder": bid.bidder }],
      new: true,
    };
    const bidRes = await this.findOneAndUpdate(filter, update, options);
    await dash.updateDash(bid.bidder,{blockchainId:blockchainId,uname:bidRes.uname,des:bidRes.des,category:bidRes.category,price:bid.amount},"bids")
    return bidRes;
  };
  
  ProductSchema.statics.updateStatus = async function (blockchainId, status,account) {
    const filter = { blockchainId: blockchainId };
    const update = {
      $set: {
        productStatus: status,
      },
    };
    const result = await this.updateOne(filter, update);
    const prod =await this.findOne({blockchainId})
    if(status==3){
      await dash.updateDash(account,{blockchainId:blockchainId,uname:prod.uname,des:prod.des,category:prod.category,price:prod.price},"purchased")
    }
    if(status==1){
      await dash.updateDash(account,{blockchainId:blockchainId,uname:prod.uname,des:prod.des,category:prod.category,price:prod.price},"pending")
    }
    if(status==0){
      await dash.updateDash(account,{blockchainId:blockchainId,uname:prod.uname,des:prod.des,category:prod.category,price:prod.price},"refund")
    }
    return result;
  };

  ProductSchema.statics.searchByUname = async function(uname) {
    // use the find method with a query document
    // use the $regex operator to match the uname field with a case-insensitive pattern
    const products = await this.find({ uname: { $regex: uname, $options: 'i' }, productStatus: { $eq: 0 } });
    // return the products array
    return products;
  };

  ProductSchema.statics.filterProducts = async function(filterOptions) {
    // destructure the filter options object
    const { category, condition, price } = filterOptions;
  
    // use the aggregate method with an array of stages
    const products = await this.aggregate([
      // use the $match stage to filter products by category and condition
      { $match: { $and: [ { category: { $in: category } }, { condition: { $in: condition } }, { productStatus: { $eq: 0 } } ] } },
      // use the $sort stage to sort products by price
      { $sort: { price: price } },
      
    ]);
  
    // return the products array
    return products;
  };

const ProductModel = mongoose.model('ProductModel', ProductSchema);

module.exports = ProductModel;
