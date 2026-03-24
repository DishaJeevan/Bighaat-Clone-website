import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, Link } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const category = query.get("category");
  const section = query.get("section");

  useEffect(() => {
    axios.get("https://bighaat-clone.onrender.com/products")
      .then(res => {
        let data = res.data;

        if (category) {
          data = data.filter(p => p.category === category);
        }

        if (section) {
          data = data.filter(p => p.section === section);
        }

        setProducts(data);
      });
  }, [category, section]);

  return (
    <div className="product-container">
      <h2>Products</h2>

      <div className="product-grid">
        {products.map(p => (
          <Link to={`/product/${p.id}`} key={p.id} className="product-card">
            <img src={p.image} alt={p.name} />
            <h4>{p.name}</h4>
            <p>₹{p.newPrice}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Products;