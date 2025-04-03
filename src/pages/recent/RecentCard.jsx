import React, { useState, useEffect, useMemo } from "react";

const RecentCard = ({ togglePop }) => {
  const [list, setList] = useState([]);

  // Fetch data
  const load = async () => {
    try {
      const response = await fetch(
        "https://backend-gamma-silk.vercel.app/api/user/allprods",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Origin: "https://frontend-amber-tau-20.vercel.app",
          },
        }
      );

      const data = await response.json();
      setList(data.prods || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Memoize the mapped JSX to prevent unnecessary computations
  const renderedList = useMemo(
    () =>
      list.map((val, index) => {
        const { img, des, uname, price } = val;
        return (
          <div
            className="box shadow"
            key={index}
            onClick={() => togglePop(val)}
          >
            <div className="img">
              {/* Lazy loading for images */}
              <img src={img} alt="" loading="lazy" />
            </div>
            <div className="text">
              <h4>{uname}</h4>
              <p>{des}</p>
            </div>
            <div className="button flex">
              <div>
                <button className="btn2">{price} ETH</button>
              </div>
            </div>
          </div>
        );
      }),
    [list, togglePop]
  );

  return <div className="content grid3 mtop">{renderedList}</div>;
};

export default RecentCard;
