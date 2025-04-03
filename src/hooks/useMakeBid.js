import { useState } from 'react'
// import { useAuthContext } from './useAuthContext'

export const useMakeBid = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  // const { dispatch } = useAuthContext()

  const makebid = async (blockchainId,bid,account,bidexists) => {
    setIsLoading(true)
    setError(null)
  
    const response = await fetch('https://backend-gamma-silk.vercel.app/api/user/makebid', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({blockchainId:blockchainId,bid:{amount:bid,bidder:account},exists:bidexists})
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

  return { makebid, isLoading, error }
}
