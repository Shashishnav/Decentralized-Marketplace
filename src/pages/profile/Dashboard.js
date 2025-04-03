import React, { useEffect } from 'react'
import { useState,useContext } from 'react'
import { ContractContext } from '../../context/ContractContext';
import './dash.css'
import Sell from './Sell'
import Pur from './Pur'
import Bids from './Bids'
import Pending from './Pending'
const Dashboard = ({togglePop}) => {
    const contract =useContext(ContractContext)
    const account=contract.account
    // const user =contract.user
    const [step, setStep] = useState(0);
    const [user,setUser]=useState({})
    const [nop,setNop]=useState(0)
    const [nopen,setNopen]=useState(0)
    const [nob,setNob]=useState(0)
    const [nol,setNol]=useState(0)
    const ShowStep = () => {
      switch(step) {
        case 0:
          return (
            <Sell togglePop={togglePop} user={user.Response}/>
          );
          
        case 1:
          return (
            <Bids togglePop={togglePop} user={user.Response}/>  
          );  
          case 2:
            return (
              <Pending togglePop={togglePop} user={user.Response}/>
            ); 
        case 3:
          return(
            <Pur togglePop={togglePop} user={user.Response}/>
          );
      }}
      const load =async ()=>{
        const response = await fetch('https://backend-gamma-silk.vercel.app/api/user/getuser', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ "address":account })
        })
        const user = await response.json()
        setUser(user)
        try{
        setNop(user.Response.purchased.length)
        setNol(user.Response.listing.length)
        setNopen(user.Response.pending.length)
        setNob(user.Response.bids.length)
      }catch(error){
        console.log(error)
      }
        
      }
      useEffect(()=>{
        load()
      },[user])

    
  return (
    <div className='dash-css'>
  <div class="container5">
   
    <section class="main">
      <div class="main-top">
        <h1>User Dashboard</h1>
        
      </div>
      <div class="users">
        <div class="card">
          <h4>Number of Products Listed</h4>
          <h3>{nol}</h3>
          <div class="per"> 
          </div>
          <button disabled={step===0} onClick={()=>{setStep(0)}}>View</button>
        </div>
        <div class="card">
         
         
          <h4>Number of BIDS</h4>
          <h3>{nob}</h3>
          <div class="per">
          </div>
          <button disabled={step===1} onClick={()=>{setStep(1)}}>View</button>
        </div>
        <div class="card">

        <h4>Number of PENDING Transactions</h4>
          <h3>{nopen}</h3>
          <div class="per">
          </div>
          <button disabled={step===2} onClick={()=>{setStep(2)}}>View</button>
        </div>
        <div class="card">
        <h4>Number of Products Purchased</h4>
          <h3>{nop}</h3>
          <div class="per">
          </div>
          <button disabled={step===3} onClick={()=>{setStep(3)}}>View</button>
        </div>
      </div>
    <div>
    {ShowStep()}
      </div>
    </section>
  </div>
    </div>
  )
}

export default Dashboard
