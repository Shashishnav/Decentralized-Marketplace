import './product.css'
import { ContractContext } from '../../context/ContractContext';
import { useContext,useState } from 'react';
import {useMakeBid} from '../../hooks/useMakeBid'
import { useStatusUpdate } from '../../hooks/useStatusUpdate';
const ethers = require('ethers')

const Product = ({ val, togglePop }) => {
    const {statusUpdate}=useStatusUpdate()
    const {makebid}=useMakeBid();
    const contract =useContext(ContractContext)
    const market=contract.market
    const provider=contract.provider
    const seller =contract.seller
    const account=contract.account
    const [bid,setBid]=useState(0)
    const [sellAcc,setSellAcc]=useState('')
    const [bidData,setBidData]=useState([])
    const [highestBidder,setHighestBidder]=useState('')
    const [stoe,setStoe]=useState('')
    const [custodianAddress,setCustodianAddress]=useState('')
    const [custodianInfo,setCustodianInfo]=useState([])
    const handleSubmission = async (e) => {
        e.preventDefault()
        var data = bids.map(o => o.bidder)
        setBidData(data)
        var bidExists=bids[data.indexOf(account)]
        bidExists = !!bidExists;
        try{
            const transaction=await market.connect(seller).bid(Number(blockchainId),Number(bid))
            await transaction.wait()
            await makebid(blockchainId,bid,account,bidExists)
            console.log(Number(blockchainId),Number(bid))
            alert("Bid added successfully")
        }
        catch(error){
          console.log(error)
          alert("Bid not added")
        }  
      };

    const relToSeller = async (e)=>{
        e.preventDefault()
        try{
            const transaction =await market.connect(seller).releaseToSeller(blockchainId)
            await transaction.wait()
            await statusUpdate(blockchainId,3,account)
            alert("AMOUNT RELEASED TO SELLER")
        }catch(error){
            console.log(error)
            alert("AMOUNT NOT RELEASED")
        }
    }

    const refundTOBuyer=async(e)=>{
        e.preventDefault()
        try{
            const transaction =await market.connect(seller).refundToBuyer(blockchainId)
            await transaction.wait()
            await statusUpdate(blockchainId,0,account)
            alert("AMOUNT REFUNDED TO BUYER")
        }catch(error){
            console.log(error)
            alert("AMOUNT NOT REFUNDED")
        }
    }

    const closeAuction=async()=>{
        try{
            const transaction =await market.connect(seller).closeAuction(blockchainId)
            await transaction.wait()
            await statusUpdate(blockchainId,1,highestBidder)
            alert("AUCTION HAS BEEN CLOSED")
        }catch(error){
            console.log(error)
            alert("AUCTION NOT CLOSED")
        }
    }

    const sendCustodian=async()=>{
        try{
            const transaction=await market.connect(seller).sendToEscrow(blockchainId,{value: ethers.parseUnits(stoe, 'ether')})
            await transaction.wait()
            await statusUpdate(blockchainId,2)
            alert("AMOUNT HAS BEEN TRANSFERRED TO CUSTODIAN")
        }catch(error){
            console.log(error)
            alert("AMOUNT HAS NOT BEEN TRANSFERRED TO CUSTODIAN")
        }
    }

      const { img,  des, uname, price,state,city,pincode,phone,email,address,category,blockchainId,bids,productStatus} = val

        if (productStatus==0 || productStatus==1) {  
            try{        
            market.connect(provider).highestBidderInfo(blockchainId).then((highestbid) => {
                setHighestBidder(highestbid[0])
                setStoe(highestbid[1].toString())
          });
        }catch(error){
            console.log(error)
        }}
        if (productStatus==2 || productStatus==3){
            try{
                market.connect(provider).escrowInfo(blockchainId).then((custodian)=>{
                                    setCustodianInfo(custodian)
                                    console.log(custodian,"custodian_info")
                          })
                          market.connect(provider).escrowAddresForProduct(blockchainId).then((custodian)=>{
                                       setCustodianAddress(custodian)
                                       console.log(custodian,"custodian_address")
                          })
                          market.connect(provider).highestBidderInfo(blockchainId).then((highestbid) => {
                            setHighestBidder(highestbid[0])
                            setStoe(highestbid[1].toString())});
            }catch(error){
                console.log(error)
            }
        }

    let max_bid = Math.max(...bids.map(o => o.amount));

    if (max_bid == "-Infinity") {
        max_bid = "No bids yet"
    }
    
    market.connect(provider).productIdInStore(blockchainId).then((sellAcc)=>{
        setSellAcc(sellAcc)
    })
    
    return (
        <div className='productdisplay'>
            <div className="back-btn">
                    <button className='back-btn1' onClick={togglePop}>← Back</button>
                </div>
        <div className="productdisplay-left">
            <div className="productdisplay-img">
                <img className='productdisplay-main-img' src={img} alt="" />
            </div>
        </div>

        <div className="productdisplay-right">
                <h1>{uname}</h1>
                <div className="productdisplay-right-description">
                    <p>{des}</p>
                </div>
                <div className="productdisplay-right-prices">
                    <p>Starting Price :{price}</p>
                </div>
                <div><p>HIGHEST BID :{max_bid}</p></div>
            {productStatus == 0 && account!=sellAcc &&(
                <div>
                <div className="custom-input">
                <input type="text" id="price" placeholder=" " onChange={(e) => setBid(e.target.value)} value={bid}/>
                <label htmlFor="name">Price*</label>
                <div className="small-text" >Enter the price of the product</div>


                <div className="product-btn">
                    <button className='product-btn1' onClick={handleSubmission}>Make A Bid</button>
                </div>

                 </div> 
            <div className="category">
                <p className='productdisplay-right-category'><span>Category: <span style={{marginLeft:"10px"}}>{category}</span></span></p>
                <h1 style={{fontSize:"24px",marginTop:"10px"}}>Address</h1>
                <hr style={{width:"80%",marginBottom:"10px"}}/>
                <ul>
                    <li><span>address  : <span style={{marginLeft:"10px"}}>{address}</span></span></li>
                    <li><span>State   : <span style={{marginLeft:"10px"}}>{state}</span></span></li>
                    <li><span>City    : <span style={{marginLeft:"10px"}}>{city}</span></span></li>
                    <li><span>Pincode : <span style={{marginLeft:"10px"}}>{pincode}</span></span></li>
                    <li><span>Phone   : <span style={{marginLeft:"10px"}}>{phone}</span></span></li>
                    <li><span>Email   : <span style={{marginLeft:"10px"}}>{email}</span></span></li>
                    
                </ul>
            </div>
            </div>
            )}
            {sellAcc==account && productStatus==0 && (<button onClick={closeAuction}>CLOSE AUCTION</button>)}
            {highestBidder==account && productStatus==1 && (<button onClick={sendCustodian}>SEND TO CUSTODIAN</button>)}
            {custodianInfo[0]==account && custodianInfo[2] == false &&(<button onClick={relToSeller}>RELEASE TO SELLER</button>)}
            {custodianInfo[1]==account && custodianInfo[2] == false &&(<button onClick={refundTOBuyer}>REFUND TO BUYER</button>)}
            {custodianInfo[2]==true && (<p>Amount from the escrow has been released. This transaction is finished</p>)} 
        </div>
    </div>
    );
}

export default Product;