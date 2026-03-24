import { Link } from "react-router-dom";
import "../App.css";

function PestCategories() {
  return (
    <>
      <section className="pest-shop">
        <div className="offers-price">
          <h1>Shop by Pest & Disease 🐞</h1>
          <p>Find solutions for your crop problems.</p>
        </div>

        <div className="offer-view-all">
          
        </div>
      </section>

      <div className="pest-categories">
        <div className="pest-categories-box">

          
          <Link to="/thrips" className="pest-categories-section">
            <img src="/images/pestimg1.webp" alt="Thrips" />
            <p>Thrips</p>
            </Link>

            <Link to="/leaf-eating" className="pest-categories-section">
            <img src="/images/pestimg2.webp" alt="Leaf Eating Caterpillar" />
            <p>Leaf Eating Caterpillar</p>
            </Link>

            <Link to="/late-blight" className="pest-categories-section">
            <img src="/images/pestimg3.webp" alt="Late Blight" />
            <p>Late Blight</p>
            </Link>

        </div>
        <div class="indias-popular">
        <img
          src="images/fotter-beforeimg1.png"
          alt="largest agricultural platform"
        />
      </div>
      </div>
    </>
  );
}

export default PestCategories;