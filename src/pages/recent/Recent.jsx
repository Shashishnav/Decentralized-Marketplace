import {React} from "react"
import Heading from "../common/Heading"
import "./recent.css"
import RecentCard from "./RecentCard"


const Recent = ({togglePop}) => {
  
  return (
    <>
      <section className='recent padding'>
        <div className='container'>
          <Heading title='Buy Products Here'/>
          <RecentCard togglePop={togglePop}/>
        </div>
      </section>
      
    </>
  )
}

export default Recent
