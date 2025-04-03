import React from 'react'
// import { useState } from 'react';
import './style.css';
const Page1 = ({formData,setFormData}) => {
  return (
    <div className='Form'>
  <div className="custom-input">
      <input type="text" id="name" placeholder=" " value={formData.uname} onChange={(e)=>setFormData({...formData, uname:e.target.value})} />
      <label htmlFor="name">Name*</label>
      <div className="small-text">Enter the name of the product</div>

    </div>

    <div className="custom-input">
      <input type="text" id="description" placeholder=" " value={formData.description} onChange={(e)=>setFormData({...formData, description:e.target.value})} />
      <label htmlFor="name">Description*</label>
      <div className="small-text">Provide a description of the product</div>

    </div>

    
    <div className="custom-input" value={formData.condition} onChange={(e)=>setFormData({...formData, condition:e.target.value})}>
      <label htmlFor="name">Condition*</label>
    </div>

    <div className="custom-dropdown">
      <select value={formData.condition} onChange={(e)=>setFormData({...formData, condition:e.target.value})} >
        <option value="" disabled>Select an option</option>
        <option value="excellent">Excellent</option>
        <option value="good">Good</option>
        <option value="fair">Fair</option>
      </select>
      {formData.condition && <div className="small-text">Selected option: {formData.condition}</div>}
    </div>

   

    <div className="custom-input" >
      <label htmlFor="name">Category*</label>
    </div>

    
    <div className="custom-dropdown">
      <select value={formData.category} onChange={(e)=>setFormData({...formData, category:e.target.value})}>
        <option value="" disabled>Select an option</option>
        <option value="Books">Books</option>
        <option value="Cameras">Cameras</option>
        <option value="Cell Phones & Accessories ">Cell Phones & Accessories </option>
        <option value="Clothing">Clothing</option>
        <option value="Coins & Paper Money">Coins & Paper Money</option>
        <option value="Collectibles">Collectibles</option>
        <option value="Computers/Tablets & Networking">Computers/Tablets & Networking</option>
        <option value="Consumer Electronics">Consumer Electronics</option>
        <option value="Crafts">Crafts</option>
        <option value="DVDs & Movies">DVDs & Movies</option>
        <option value="Entertainment Memorabilia">Entertainment Memorabilia</option>
        <option value="Gift Cards & Coupons">Gift Cards & Coupons</option>
        <option value="Music">Music</option>
        <option value="Musical Instruments & Gear">Musical Instruments & Gear</option>
        <option value="Pet Supplies">Pet Supplies</option>
        <option value="Pottery & Glass">Pottery & Glass</option>
        <option value="Sporting Goods">Sporting Goods</option>
        <option value="Stamps">Stamps</option>
        <option value="Tickets">Tickets</option>
        <option value="Toys & Hobbies">Toys & Hobbies</option>
        <option value="Video Games">Video Games</option>
      </select>
      {formData.category && <div className="small-text">Selected option: {formData.category} </div>}
    </div>
  


    <div className="custom-input">
      <input type="number" id="price" placeholder=" " value={formData.price} onChange={(e)=>setFormData({...formData, price:e.target.value})} />
      <label htmlFor="name">Starting Price*</label>
      <div className="small-text">Enter the starting price of the product</div>

    </div>
    </div>
  )
}

export default Page1
