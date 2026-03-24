import { Link } from "react-router-dom";
import "../App.css";

function Categories() {
  return (
    <section className="categories">
      <h1>Categories</h1>

      <div className="categories-box">
       <Link to="/offer-page" className="category-section">
          <img src="/images/offers.webp" alt="offers" />
          <p>Offers</p>
        </Link>

        <Link to="/cropnutrition" className="category-section">
          <img src="images/nurtrients.webp" alt="nutrients" />
          <p>Nutrients</p>
        </Link>
 
        <a href="growth-promoters" className="category-section">
          <img src="images/growth promoters.webp" alt="growth promoters" />
          <p>Growth Promoters</p>
        </a>
      
        <Link to="/equipments" className="category-section">
          <img src="images/farm machinary.webp" alt="farm machinery" />
          <p>Farm Machinery</p>
        </Link>
      
        <Link to="/organic" className="category-section">
          <img src="/images/organic.webp" alt="organic farming" />
          <p>Organic Farming</p>
        </Link>
      
        <Link to="/animalhusbandry" className="category-section">
          <img src="/images/animal.webp" alt="animal husbandry" />
          <p>Animal Husbandry</p>
        </Link>     
      </div>
    </section>
  );
}

export default Categories;
