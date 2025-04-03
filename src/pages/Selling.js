import { useEffect, useState } from "react"
// import { useList } from "../../hooks/useList"
// import './selling.css';
import Marketplace from '../artifacts/contracts/Marketplace.sol/Marketplace.json'
const ethers = require('ethers')



const Selling = () => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [category,setCategory] = useState('')
    const [startPrice,setstartPrice] = useState('')
    const [condition,setCondition] = useState('')
    const [phone,setPhone] = useState('')
    const [address,setAddress] = useState('')
    const [city,setCity] = useState('')
    const [pincode,setpincode] = useState('')
    const [seller,setSeller]=useState('')
    const [market,setMarket]=useState('')
    const [account,SetAccount]=useState('')
    const [provider,setProvider]=useState('')
    // const [market,setMarket]=useState('')
    // const {list, error, isLoading} = useList()

    const handleSubmit = async (e) => {
        e.preventDefault()
    
        // await list(name,description,category,startPrice,condition,phone,address,city,pincode)
      }

      const load =async()=>{
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider)
        const market =new ethers.Contract('0x5FbDB2315678afecb367f032d93F642f64180aa3',Marketplace['abi'],provider)
        
        setMarket(market)
        // const productIndex =await market.productIndex();
        // console.log("productIndex : ",productIndex.toString());

        // console.log(await market.connect(provider).getProduct(4))
        
        console.log("Contract address",market)
      }

      async function getAccountAddress() {
        try {
          
          await provider.send("eth_requestAccounts", []);
          const seller = await provider.getSigner();
          const account = await seller.getAddress();
          SetAccount(account)
          
        //   console.log("Account address:", signer);
          setSeller(seller)
        } catch (error) {
          console.error("Error getting account address:", error);
        }
      }

      async function addProduct(e){
        try{
            e.preventDefault()
            // const sell =new ethers.Contract('0x5FbDB2315678afecb367f032d93F642f64180aa3',Marketplace['abi'],seller)
            const transaction=await market.connect(seller).addProduct(name,category,"abc","desc",startPrice,0);
            // const transaction=await market.connect(seller).bid(2,150)
            // const transaction=await market.connect(seller).closeAuction(2)
            // const transaction=await market.connect(seller).sendToEscrow(2,{value: ethers.parseUnits('150', 'ether')})
            // const transaction=await market.connect(seller).releaseToSeller(2)

            await transaction.wait()
            console.log("product added")
            // console.log(name,category.type,startPrice.type)
            
        }
        catch(error){
            console.error("failed to add product",error);
        }
      }

      useEffect(()=>{
            load()
      },[])
    
    return (
        <div>
        {account ? (
        <button
          type="button"
          className='nav__connect'
        >
          {account.slice(0, 6) + '...' + account.slice(38, 42)}
        </button>
      ) : (
        <button
          type="button"
          className='nav__connect'
          onClick={getAccountAddress}
        >
          Connect
        </button>
      )}
            <div className="title">
                LIST AN ITEM 
            </div>

            <div className="form">
            <form onSubmit={handleSubmit}>
                <div className="input_field">
                    <label >NAME</label>
                    <input type="text" className="input" onChange={(e) => setName(e.target.value)} 
        value={name}/>
                </div>

                <div className="input_field">
                    <label >DESCRIPTION</label>
                    <textarea className="textarea" onChange={(e) => setDescription(e.target.value)} 
        value={description}></textarea>
                </div>

                <div className="input_field">
                    <label> UPLOAD IMAGE </label>
                    <input type="file" multiple='multiple' id='file' className="filename" />
                    <div />

                    <div className="input_field">
                        <label >CATEGORY</label>
                        <select name="category" id="category" onChange={(e) => setCategory(e.target.value)} 
        value={category} >
                            <option>Art</option>
                            <option>Books</option>
                            <option>Cameras</option>
                            <option>Cell Phones & Accessories</option>
                            <option>Clothing</option>
                            <option>Coins & Paper Money</option>
                            <option>Collectibles</option>
                            <option>Computers/Tablets & Networking</option>
                            <option>Consumer Electronics</option>
                            <option>Crafts</option>
                            <option>DVDs & Movies</option>
                            <option>Entertainment Memorabilia</option>
                            <option>Gift Cards & Coupons</option>
                            <option>Music</option>
                            <option>Musical Instruments & Gear</option>
                            <option>Pet Supplies</option>
                            <option>Pottery & Glass</option>
                            <option>Sporting Goods</option>
                            <option>Stamps</option>
                            <option>Tickets</option>
                            <option>Toys & Hobbies</option>
                            <option>Video Games</option>
                        </select>
                    </div>

                    <div className="input_field">
                        <label >START PRICE</label>
                        <input type="number" className="input" onChange={(e) => setstartPrice(e.target.value)} 
        value={startPrice} />
                    </div>

                    <div className="input_field" >
                        <label >CONDITION</label>
                        <select name="category" id="category" onChange={(e) => setCondition(e.target.value)} 
        value={condition} >
                            <option>new</option>
                            <option>old</option>
                        </select>
                    </div>
                    <div className="input_field">
                        <label> PHONE N.O: </label>
                        <input type="text" className='input' onChange={(e) => setPhone(e.target.value)} 
        value={phone} />
                    </div>
                    <div className="input_field">
                        <label>ADDRESS</label>
                        <textarea className='textarea' onChange={(e) => setAddress(e.target.value)} 
        value={address} ></textarea>
                    </div>
                    <div className='input_field'>
                        <label >CITY</label>
                        <input type="text" className='input' onChange={(e) => setCity(e.target.value)} 
        value={city} />
                    </div>
                    <div className="input_field">
                        <label >PIN-CODE</label>
                        <input type="text" className='input' onChange={(e) => setpincode(e.target.value)} 
        value={pincode} />
                    </div>
                    
                    {/* <div className="input_field">
                        <p>Click the button to get your coordinates.</p>
                        <button onclick={getLocation()}>Add Current Location</button>
                        <p id="demo"></p>
                    </div> */}
                    {/* <div className="btnn">
                        <input type="submit" value="LIST ITEM" className='btn' />
                    </div> */}

                    <button onClick={addProduct}>List Item</button>
                    {/* {error && <div className="error">{error}</div>}     */}
                    
                </div>
                </form>
            </div>
        </div>
    );
}


export default Selling;