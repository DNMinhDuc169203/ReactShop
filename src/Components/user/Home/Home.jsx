import React from "react";
import "./Home.css";
import Product from "./Product";
import Prominent from "./Prominent";
import Footer from "../Footer/Footer";

const Home = () => {
  
  return (
    <div>
      <div className="home-container">
        {/* Banner */}
        <div className="image-container">
          <img
            src="https://cdn.pixabay.com/photo/2024/03/30/19/29/ai-generated-8665327_1280.png"
            alt=""
          />
        </div>
      </div>
   <div className="pt-5">
<Product/>
   </div>
<div>
  <Prominent/>
</div>

      <div className="pt-5">
   <Footer/>
      </div>
    </div>
  );
};

export default Home;
