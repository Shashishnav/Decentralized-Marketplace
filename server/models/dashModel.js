const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const product = new Schema({
    blockchainId: String,
    uname:String,
    des: String,
    category: String,
    price: String
})

const dashSchema = new Schema({
    address : String,
    bids : [product],
    pending :[product],
    listing : [product],
    purchased : [product]
})

dashSchema.statics.updateDash = async function(address, productId, method) {
    // find the document by address or create a new one if not found
    let doc = await this.findOneAndUpdate(
      { address: address },
      {},
      { upsert: true, new: true }
    );
    // use the $push operator to add the productId to the array based on the method
    if(method=="bids"){
    let update = { $push: {} };
    update.$push[method] = productId;
    // update the document and return the result
    return await doc.updateOne(update);
    }else if(method=="pending"){
        // use the $pull and $push operators to move the productId from bids to pending
        console.log(productId)
        let moveUpdate = { $pull: { bids: productId }, $push: { pending: productId } };
        // update the document and return the result
        return await doc.updateOne(moveUpdate);
    }else if(method=="listing"){
        // use the $push operator to add the productId to the listing array
        let update = { $push: { listing: productId } };
        // update the document and return the result
        return await doc.updateOne(update);
    }else if(method=="refund"){
        let update = {$pull:{pending:productId}}
        return await doc.updateOne(update)
    }else{
        // use the $pull and $push operators to move the productId from pending to purchased
        let moveUpdate = { $pull: { pending: productId }, $push: { purchased: productId } };
        // update the document and return the result
        return await doc.updateOne(moveUpdate);
    }
  };

  dashSchema.statics.getUser=async function(address){
    const user = await this.findOne({address})
    return user
  }

// // use constants to store the operators
// const PUSH = { $push: {} };
// const PULL = { $pull: {} };

// // use a function to find or create a document by address
// async function findOrCreateDoc(address) {
//   // use the lean() option to get a plain JSON object
//   return await this.findOneAndUpdate(
//     { address: address },
//     {},
//     { upsert: true, new: true, lean: true }
//   );
// }

// // use a function to update a document by address and method
// async function updateDoc(address, productId, method) {
//   // find or create the document
//   let doc = await findOrCreateDoc(address);
//   // use a switch statement to handle different methods
//   switch (method) {
//     case "bids":
//       // use the PUSH operator to add the productId to the bids array
//       PUSH.bids = productId;
//       // update the document and return the result
//       return await doc.updateOne(PUSH);
//     case "pending":
//       // use the PULL and PUSH operators to move the productId from bids to pending
//       PULL.bids = productId;
//       PUSH.pending = productId;
//       // update the document and return the result
//       return await doc.updateOne({ ...PULL, ...PUSH });
//     case "listing":
//       // use the PUSH operator to add the productId to the listing array
//       PUSH.listing = productId;
//       // update the document and return the result
//       return await doc.updateOne(PUSH);
//     case "purchased":
//       // use the PULL and PUSH operators to move the productId from pending to purchased
//       PULL.pending = productId;
//       PUSH.purchased = productId;
//       // update the document and return the result
//       return await doc.updateOne({ ...PULL, ...PUSH });
//     default:
//       // handle invalid or missing method
//       throw new Error("Invalid or missing method");
//   }
// }

// // use the updateDoc function as the static method
// dashSchema.statics.updateDash = updateDoc;


const dashboardModel = mongoose.model('dashboard',dashSchema)
module.exports = dashboardModel