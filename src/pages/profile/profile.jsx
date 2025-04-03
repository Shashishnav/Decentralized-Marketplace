import {React,useState} from 'react';
import Header from '../common/Header';
import Product from '../recent/product';
import Dashboard from './Dashboard';

const Profile = () => {
  const [val, setVal] = useState({});
  const [toggle, setToggle] = useState(false);

  const togglePop = (val) => {
    setVal(val);
    toggle ? setToggle(false) : setToggle(true);
    console.log("togglepop",val)
  };

  return (
    <div>
      <Header />
      {toggle ? (
        <Product val={val} togglePop={togglePop} />
      ) : (
        <>
          <Dashboard togglePop={togglePop}/>
        </>
      )}
    </div>
  );
};

export default Profile
