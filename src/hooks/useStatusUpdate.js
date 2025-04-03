import { useState } from 'react'

export const useStatusUpdate = () =>{
    const [error, setError] = useState(null)
    const statusUpdate =async (blockchainId,status,address)=>{
        setError(null)

        const response = await fetch('https://backend-gamma-silk.vercel.app/api/user/updatestatus', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({blockchainId,status,account:address })
          })
          const json = await response.json()

          if (!response.ok) {
            setError(json.error)
          }
    }
    return {statusUpdate,error}
}