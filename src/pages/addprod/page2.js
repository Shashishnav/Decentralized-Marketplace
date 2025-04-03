import React from 'react'
import './style.css'
const page2 = ({formData,setFormData}) => {
  return (
    <div className='Form'>
      <div className="custom-input">
      <input type="text" id="address" placeholder=" " value={formData.address} onChange={(e)=>setFormData({...formData, address:e.target.value})} />
      <label htmlFor="name">Address*</label>
      <div className="small-text">Enter the address where the product is located</div>

    </div>

    <div className="custom-input1">
      <div>
      <input className='input' type="text" id="city" placeholder=" " value={formData.city} onChange={(e)=>setFormData({...formData, city:e.target.value})} />
      <label htmlFor="name">City*</label></div>
      <div className="custom-input1">
      <input className='input' type="text" id="city" placeholder=" " value={formData.state} onChange={(e)=>setFormData({...formData, state:e.target.value})} />
      <label htmlFor="name">State*</label></div>

      <div className="custom-input1">
      <input className='input' type="text" id="city" placeholder=" " value={formData.pincode} onChange={(e)=>setFormData({...formData, pincode:e.target.value})} />
      <label htmlFor="name">Pincode*</label></div>
      
      
    </div>


    <div className="custom-input2">
      <div className="custom-input2">
      <input className='input' type="text" id="city" placeholder=" " value={formData.phone} onChange={(e)=>setFormData({...formData, phone:e.target.value})} />
      <label htmlFor="name">Phone*</label></div>
      <div className="custom-input2">
      <input className='input' type="text" id="city" placeholder=" " value={formData.email} onChange={(e)=>setFormData({...formData, email:e.target.value})} />
      <label htmlFor="name">Email*</label></div>

      
      
    </div>
    

    <div className="custom-input2">
      <input type="text" id="address" placeholder=" " value={formData.img} onChange={(e)=>setFormData({...formData, img:e.target.value})} />
      <label htmlFor="name">Photo URL*</label>
      {/* <div className="small-text">Enter the Photo URL</div> */}
    </div>
  

</div>
  )
}

export default page2
