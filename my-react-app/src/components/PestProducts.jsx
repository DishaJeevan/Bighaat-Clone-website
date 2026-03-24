import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

function PestProducts() {
  const { type } = useParams(); 
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("https://bighaat-clone.onrender.com/products")
      .then((res) => {
        const filtered = res.data.filter(
          (p) => p.subCategory === type
        );
        setProducts(filtered);
      })
      .catch((err) => console.log(err));
  }, [type]);

  return (
    <div className="seeds-page">
      <h1 style={{ textTransform: "capitalize" }}>
        {type} ({products.length})
      </h1>

      <div className="products-grid-menu">
        {products.map((product) => (
          <Link to={`/product/${product.id}`} key={product.id}>
            <div className="product-card-menu">
              <img
                src={product.image}
                alt={product.name}
              />
              <h4>{product.name}</h4>
              <p>{product.brand}</p>
              <p>₹{product.newPrice}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default PestProducts;