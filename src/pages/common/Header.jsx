import "./header.css"
import { nav } from "../data/Data"
import { Link } from "react-router-dom"
import { ContractContext } from "../../context/ContractContext"
import { useContext} from "react"
import { useLogout } from '../../hooks/useSignout'

const Header = () => {
  const { logout } = useLogout()
  const contract =useContext(ContractContext);
  const account=contract.account
  const getAccountAddress=contract.getAccountAddress


  const handleClick = () => {
    logout()
  }

  return (
    <>
      <header>
        <div className='container flex'>
          <div className='logo'>
            <h1 style={{color:'green'}}> <i className="fa fa-shop" style={{fontSize:'30px',marginRight:'8px'}}></i>DeKart</h1>
          </div>
          <div className='nav'>
            <ul className='flex'>
              {nav.map((list, index) => (
                <li key={index}>
                  <Link to={list.path}>{list.text}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className='button flex' style={{display:"inline-block"}}>
          {account ? (
        <button
          type="button"
          className='btn1'
        >
          {account.slice(0, 6) + '...' + account.slice(38, 42)}
        </button>
      ) : (
        <button
          type="btn1"
          className='nav__connect'
          onClick={getAccountAddress}
        >
          Connect
        </button>
      )}
        <button className='logout-btn' onClick={handleClick}>
               LOGOUT <i className="fa fa-sign-out" style={{fontSize:'17px', color:'red'}}></i>
        </button>  
          </div>
        </div>
      </header>
    </>
  )
}

export default Header