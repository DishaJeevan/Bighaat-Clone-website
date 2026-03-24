import React from "react";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import Offers from "../components/Offers";
import BestSelling from "../components/BestSelling";
import Brand from "../components/Brand";
import Growth from "../components/Growth";
import SprayersandNutrients from "../components/SprayersandNutrients";
import { images } from "/src/components/Data";
import Pest from "../components/Pest";
import Nutrients from "../components/Nutrients";
import SeedsSection from "../components/SeedsSection";
import SmartFarming from "../components/SmartFarming";

function Home() {
  return (
    <>
      <Hero images={images} />
      <Categories />
      <Offers />
      <BestSelling />
      <Brand />
      <div id="growth-section">
        <Growth />
      </div>
      <SmartFarming />
      <SprayersandNutrients />
      <Nutrients/>
      <SeedsSection /> 
      <Pest/>
      
      
      
     
    </>
  );
}

export default Home;
