const dash =require('../models/dashModel')

const updateDash = async(req,res)=>{
    const {address,productId,method}=req.body
    try{
        const result = await dash.updateDash(address, productId, method)
        res.status(200).json({Response:result})
    }catch(error){
        res.status(400).json({error:error.message})
    }
}

const getUser =async(req,res)=>{
    const {address}=req.body
    try{
        const result = await dash.getUser(address)
        res.status(200).json({Response:result})
    }catch(error){
        res.status(400).json({error:error.message})
    }
}

module.exports={updateDash,getUser}