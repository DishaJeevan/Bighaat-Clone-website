import "./App.css";
import GrowthPage from "./components/GrowthPage";
import { useContext } from "react";
import GreenStrip from "./components/GreenStrip";
import Header from "./components/Header";
import Navbar from "./components/NavBar";
import Login from "./components/Login";
import Sell from "./components/Sell";
import Corporate from "./components/Corporate";
import Bulkorder from "./components/Bulkorder";
import Home from "./pages/Home"; 
import { Routes, Route } from "react-router-dom";
import { CartContext } from "./components/CartContext";
import Footer from "./components/Footer";
import Callbutton from "./components/Callbutton";
import Brandmenue from "./components/Brandmenue";
import Seedsmenue from "./components/Seedsmenue";
import Cropprotectionmenue from "./components/Cropprotectionmenue";
import Cropnutritionmenue from "./components/Cropnutritionmenue";
import Equipmentsmenue from "./components/Equipmentsmenue";
import Animalhusbandrymenue from "./components/Animalhusbandrymenue";
import Organic from "./components/Organic";
import Tapas from "./components/Tapas";
import Services from "./components/Services";
import Vedica from "./components/Vedica"; 
import Blogs from "./components/Blogs";
import TrackOrder from "./components/TrackOrder";
import OfferPage from "./components/OfferPage";
import Wishlist from "./components/Wishlist";
import { CartProvider } from "./components/CartContext";
import Cart from "./components/Cart";
import Hero from "./components/Hero";
import Tapasimplements from "./components/Tapasimplements";
import Tapascropnutrition from "./components/Tapascropnutrition";
import Tapascropprotection from "./components/Tapascropprotection";
import 'bootstrap/dist/css/bootstrap.min.css';
import Otppage from "./components/Otppage";
import IndividualPage from "./components/IndividualPage";
import Products from "./components/Products";
import Thrips from "./components/Thrips";
import LeafEating from "./components/LeafEating";
import LightBlight from "./components/LightBlight";
import PestProducts from "./components/PestProducts";
import FlowerFruits from "./components/FlowerFruits";
import GreenLeaves from "./components/GreenLeaves";
import NutrientDeficiencies from "./components/NutrientDeficiencies";
import BestPage from "./components/BestPage";


function App() {
  const { isCartOpen } = useContext(CartContext);

  return (
    <>
      <GreenStrip />
      <Header />
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />          
        <Route path="/login" element={<Login />} />    
        <Route path="/sell" element={<Sell />} />      
        <Route path="/bulk-orders" element={<Bulkorder />} /> 
        <Route path="/corporate" element={<Corporate />} />   
        <Route path="/call-btn" element={<Callbutton />} /> 
        <Route path="/brands" element={<Brandmenue />} /> 
        <Route path="/seedsmenue" element={<Seedsmenue />} />
        <Route path="/cropprotection" element={<Cropprotectionmenue />} /> 
        <Route path="/cropnutrition" element={<Cropnutritionmenue />} /> 
        <Route path="/equipments" element={<Equipmentsmenue />} /> 
       <Route path="/animalhusbandry" element={<Animalhusbandrymenue />} />
        <Route path="/organic" element={<Organic />} /> 
        <Route path="/tapas" element={<Tapas />} /> 
        <Route path="/services" element={<Services />} /> 
        <Route path="/vedica" element={<Vedica />} /> 
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/tapasimplements" element={<Tapasimplements />} />
        <Route path="/tapasnutrition" element={<Tapascropnutrition />} />
        <Route path="/tapasprotection" element={<Tapascropprotection />} />
        <Route path="/otp" element={<Otppage />} />
       <Route path="/product/:id" element={<IndividualPage />} />
       <Route path="/products" element={<Products />} />
       <Route path="/thrips" element={<Thrips />} />
<Route path="/leaf-eating" element={<LeafEating />} />
<Route path="/late-blight" element={<LightBlight />} />
  <Route path="/flower-fruits" element={<FlowerFruits />} />
<Route path="/green-leaves" element={<GreenLeaves />} />
<Route path="/nutrient-deficiencies" element={<NutrientDeficiencies />} />
<Route path="/growth-promoters" element={<GrowthPage />} />
<Route path="/offer-page" element={<OfferPage />} />
<Route path="/best-selling" element={<BestPage />} />
       
       
      </Routes>
      <Footer/>
        {isCartOpen && <Cart />}
    </>
  );
}
export default App;
