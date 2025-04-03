import { createContext, useEffect, useState } from "react";
import Marketplace from '../artifacts/contracts/Marketplace.sol/Marketplace.json';
const ethers = require('ethers');

export const ContractContext = createContext();

export const ContractContextProvider = ({ children }) => {
  const [market, setMarket] = useState('');
  const [provider, setProvider] = useState('');
  const [account,SetAccount]=useState('')
  const [seller,setSeller]=useState('')
  // const [user,setUser]=useState({})

  useEffect(() => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);

    const market = new ethers.Contract('0x1Ad4FDBAcCC919E8575a546Bd2dc6534Bb50c8f7', Marketplace['abi'], provider);
    console.log(market)
    setMarket(market);
    
    const connectWallet = async () => {
      await provider.send("eth_requestAccounts", []);
      const acc = await provider.getSigner();
      const account = await acc.getAddress();
      SetAccount(account)
      setSeller(acc)
      // const response = await fetch('https://backend-gamma-silk.vercel.app/api/user/getuser', {
      //   method: 'POST',
      //   headers: {'Content-Type': 'application/json'},
      //   body: JSON.stringify({ "address":account })
      // })
      // const user = await response.json()
      // setUser(user)
    }
    connectWallet()
  }, []);

  async function getAccountAddress() {
    try {
      
      await provider.send("eth_requestAccounts", []);
      const acc = await provider.getSigner();
      const account = await acc.getAddress();
      SetAccount(account)
      setSeller(acc)
    } catch (error) {
      console.error("Error getting account address:", error);
    }
  }

  return (
    <ContractContext.Provider value={{ market,provider,account,getAccountAddress,seller}}>
      {children}
    </ContractContext.Provider>
  );
};
