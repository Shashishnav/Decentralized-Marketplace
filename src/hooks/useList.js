import { useState } from 'react'
// import { useAuthContext } from './useAuthContext'

export const useList = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  // const { dispatch } = useAuthContext()

  const list = async (blockchainId,uname,des,category,img,price,phone,city,address,state,email,pincode,condition,account) => {
    setIsLoading(true)
    setError(null)
  
    const response = await fetch('https://backend-gamma-silk.vercel.app/api/user/list', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({blockchainId,uname,des,category,img,price,phone,city,address,state,email,pincode,condition,account })
    })
    const json = await response.json()

    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }
    if (response.ok) {
    //   update loading state
      setIsLoading(false)
    }
  }

  return { list, isLoading, error }
}
