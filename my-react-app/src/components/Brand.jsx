import { Link } from "react-router-dom";
import "../App.css";
import { exclusiveOffers } from "../components/Data";
import { brands } from "../components/Data";
function ExclusiveBrand() {
  return (
    <>
      <div className="exclusive-offerad">
        <h1>Exclusive Offers</h1>

        <div className="exclusive-offerad-box">
          {exclusiveOffers.map((offer) => (
            <Link  key={offer.id}  to={offer.link} className="exclusive-offerad-section">
              <span className="ad-tag">Ad</span>
              <img src={offer.image} alt={offer.alt} />
            </Link>
          ))}
        </div>
      </div>

      <div className="brand-section">
        <div className="brand-header">
          <h1>Brands</h1>
          <Link to="/brands" className="brand-view-all">
            View All
          </Link>
        </div>

        <div className="brand-box">
          {brands.map((brand) => (
            
            <Link key={brand.id} to={brand.link} className="brand-section-box">
              <img src={brand.image} alt={brand.alt} />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default ExclusiveBrand;
