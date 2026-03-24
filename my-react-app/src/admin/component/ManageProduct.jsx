import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ManageProduct() {
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get("https://bighaat-clone.onrender.com/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    getProducts();
  }, []);

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`https://bighaat-clone.onrender.com/delete-product/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
    <div className="manage-product-card">
      <h2 className="manage-card-title">Manage Products</h2>
      <div className="manage-table-container">
        <table className="table table-bordered product-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>ID</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Category</th>
              <th>SubCategory</th>
              <th>Section</th>
              <th>Rating</th>
              <th>New Price</th>
              <th>Old Price</th>
              <th>Discount</th>
              <th>Save Amount</th>
              <th>Size</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>
                  <img src={p.image} alt={p.name} width="50"/>
                </td>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.brand}</td>
                <td>{p.category}</td>
                <td>{p.subCategory}</td>
                <td>{p.section}</td>
                <td>{p.star}</td>
                <td>₹{p.newPrice}</td>
                <td>₹{p.oldPrice}</td>
                <td>{p.discount}%</td>
                <td>₹{p.saveAmount}</td>
                <td>{p.size}</td>
                <td className="action-btns">

                <button className="edit-btn" onClick={() => navigate(`/admin/edit-product/${p._id}`)}>
                  <i className="fas fa-edit"></i>
                </button>

                <button className="delete-btn" onClick={() => deleteProduct(p._id)}>
                  <i className="fas fa-trash"></i>
                </button>
              </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageProduct;
