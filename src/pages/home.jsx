import {React,useEffect,useState} from 'react';
import Hero from './hero/Hero';
import Recent from './recent/Recent';
import Header from './common/Header';
import Product from './recent/product';

const Home = () => {
  const [val, setVal] = useState({});
  const [toggle, setToggle] = useState(false);

  const togglePop = (val) => {
    setVal(val);
    toggle ? setToggle(false) : setToggle(true);
    console.log("togglepop",val)
  };
  const load =async()=>{
    const response = await fetch('https://backend-gamma-silk.vercel.app/api/user/allprods', {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    })
    const json = await response.json()
    console.log(json)
  }
  useEffect(()=>{
    load()
},[])
  return (
    <div>
      <Header />
      {toggle ? (
        <Product val={val} togglePop={togglePop} />
      ) : (
        <>
          <Hero />
          <Recent togglePop={togglePop}/>
        </>
      )}
    </div>
  );
};

export default Home;
