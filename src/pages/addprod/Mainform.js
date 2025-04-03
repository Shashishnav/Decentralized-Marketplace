import { useContext, useState } from 'react';
import React from 'react'
import Page1 from './page1';
import Page2 from './page2';
import './style.css';
import Header from '../common/Header'
import { ContractContext } from '../../context/ContractContext';
import { useList } from '../../hooks/useList';

const Mainform = () => {
  const {list} = useList()
  const contract =useContext(ContractContext)
  const market=contract.market
  const seller =contract.seller
  const account=contract.account
  const [step, setStep] = useState(0);
  const [step1, setStep1] = useState('Product Details');
  const [num, setNum] = useState(1);
  const [formData, setFormData] = useState({
    uname: "",
    description: "",
    category: "",
    img: "",
    condition: "",
    price: 0,
    phone: "",
    city:"",
    address: "",
    state:"",
    email:"",
    pincode: ""
  });

  const [left, setLeft] = useState('0px');

  const leftclick = () => {
    setLeft('0px');
  };
  const rightclick = () => {
    setLeft('110px')
  }
  const handleSubmission = async (e) => {
    e.preventDefault()
    try{
        const transaction=await market.connect(seller).addProduct(formData.uname,formData.category,formData.price,0);
        await transaction.wait()
        var blockchainId =await market.productIndex();
        blockchainId=await blockchainId.toString();
        await list(blockchainId,formData.uname,formData.description,formData.category,formData.img,formData.price,formData.phone,formData.city,formData.address,formData.state,formData.email,formData.pincode,formData.condition,account)
        alert("Product added successfully")
    }
    catch(error){
      console.log(error)
      alert("Prod not added")
    }  
    
  };


  const ShowStep = () => {
    if (step === 0) {

      return (
        <Page1 formData={formData} setFormData={setFormData} />
      );
    }
    else if (step === 1) {
      // setStep1('Address Details')
      return (

        <Page2 formData={formData} setFormData={setFormData} />

      );
    }
  }
  return (
    <>
    <Header/>
    <div className='content-add'>
      <div className="container2">
        <div className='heading1'>
          <h1 className='head'>Add New Product Form</h1>
          <p className='des'>Fill in the details to add a new Product</p>
        </div>
      </div>
      <p className='step'>Step {num} of 2</p>
      <h2 className='step1'>{step1}</h2>
  
      <div className='progress-bar'>
        <div className='progress' style={{ width: step === 0 ? "50%" : step === 1 ? "100%" : "100%" }}>

        </div>
        <div>
          {ShowStep()}
        </div>
        <div className="btn-container2">
          <div className="button-box">
            <div id="btn-add" style={{ left }}></div>
            <button className="btn1-add" disabled={step === 0} onClick={() => { setStep(step - 1); setStep1('Product Details'); setNum(1); leftclick() }}>Prev</button>
            <button className="btn1-add" disabled={step === 1} onClick={() => {
              setStep(step + 1);
              setStep1('Address Details'); setNum(2); rightclick()}}>Next</button>
          </div>
          {step === 1 && (
              <button className="btn3-add" onClick={handleSubmission}>
                Submit
              </button>
            )}
        </div>
      </div>
     
          
    </div>
    </>
  )
}

export default Mainform
