const Item =require('../models/useListAnItem')

const listItem = async(req,res)=>{
    
    const {blockchainId,uname,des,category,img,price,phone,city,address,state,email,pincode,condition,account}=req.body

    try{
        const item = await Item.list(blockchainId,uname,des,category,img,price,phone,city,address,state,email,pincode,condition,account)
        res.status(200).json({Response:"item listed"})
    }catch(error){
        res.status(400).json({error:error.message})
    }
    
}

const allprods = async(req,res)=>{
    try{
        const prods =await Item.allprods()
        res.status(200).json({prods})
    }catch(error){
        res.status(400).json({error:error.message})
    }
}

const getprod = async(req,res)=>{
    const {blockchainId}=req.body
    try{
        const prods =await Item.getprod(blockchainId)
        res.status(200).json({prods})
    }catch(error){
        res.status(400).json({error:error.message})
    }
}

const makebid=async(req,res)=>{
    const{blockchainId,bid,exists}=req.body
    try{
        if(exists){
            const bids = await Item.updatebid(blockchainId,bid)
        }
        else{
        const bids =await Item.makebid(blockchainId,bid)
        }// console.log("makebid")
        res.status(200).json("Bid ADDED MONGO")
    }catch(error){
        res.status(400).json({error:error.message})
    }
}

const updateStatus = async (req, res) => {
    // Get the blockchainId and status from the request body
    const { blockchainId, status ,account} = req.body;
    try {
      // Use await to get the result
      const result = await Item.updateStatus(blockchainId, status, account);
      // Send the result as a JSON response
      res.status(200).json("STATUS UPDATED");
    } catch (error) {
      // Handle error
      res.status(400).json({ error: error.message });
    }
  };

  const searchByUname = async (req, res) => {
    const { uname } = req.body; // get the uname from the request body
    try {
      // use the static method to search by uname
      const products = await Item.searchByUname(uname);
      // send a success response with the products array
      res.status(200).json({ products });
    } catch (error) {
      // send an error response with the error message
      res.status(400).json({ error: error.message });
    }
  };

  const filterProducts = async (req, res) => {
    // get the filter options from the request body
    const filterOptions = req.body;
    console.log(filterOptions)
    try {
      // use the filterProducts method on the Product model to get the products
      const products = await Item.filterProducts(filterOptions);
  
      // send a success response with the products array
      res.status(200).json({ products });
    } catch (error) {
      // send an error response with the error message
      res.status(400).json({ error: error.message });
    }
  };

  module.exports={listItem,allprods,makebid,updateStatus,getprod,searchByUname,filterProducts}
