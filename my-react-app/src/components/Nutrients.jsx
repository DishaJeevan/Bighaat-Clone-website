import { Link } from "react-router-dom";
import "../App.css";

function Nutrients() {
  return (
    <>
      <section className="nutrients-shop">
        <div className="offers-price">
          <h1>Shop by Nutrients 🌱</h1>
          <p>Choose the right nutrients.</p>
        </div>

        <div className="offer-view-all">
          
        </div>
      </section>

      <div className="nutrients-categories">
        <div className="nutrients-categories-box">

          <Link to="/flower-fruits" className="nutrients-categories-section">
            <img src="/images/shopbynutrients4.webp" alt="Flower and Fruits" />
            <p>Flower and Fruits</p>
          </Link>

          <Link to="/green-leaves" className="nutrients-categories-section">
            <img src="/images/shopbynutrients5.webp" alt="Green Leaves" />
            <p>Green Leaves</p>
          </Link>

          <Link to="/nutrient-deficiencies" className="nutrients-categories-section">
            <img src="/images/shopbynutrients6.webp" alt="Nutrient Deficiencies" />
            <p>Nutrient Deficiencies</p>
          </Link>

        </div>
        
      </div>
    </>
  );
}

export default Nutrients;