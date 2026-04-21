import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ManageProduct() {
  const [products, setProducts] = useState([]);
   const [keyword, setKeyword] = useState("");

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

  const handleSearch = async () => {
  try {
    const res = await axios.get(
      "https://bighaat-clone.onrender.com/products"
    );

    const searchText = keyword.trim().toLowerCase();

    const filtered = res.data.filter((p) =>
      p.name?.toLowerCase().includes(searchText.toLowerCase())
    );

    setProducts(filtered);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  if (!keyword.trim()) {
    const getProducts = async () => {
      try {
        const res = await axios.get("https://bighaat-clone.onrender.com/products");
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    getProducts();
  }
}, [keyword]);

  return (
    <div className="manage-product-card">
      
      <h2 className="manage-card-title" >Manage Products </h2>
      <div className="manage-search-box">
        <input type="text" placeholder="Search Product name" value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleSearch();
        }
    }}/>  
         <button onClick={handleSearch}>
    <i className="fa-solid fa-magnifying-glass"></i>
  </button>
        </div>
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
          
              <th>New Price</th>
              <th>Old Price</th>
              <th>Discount</th>
              <th>Save Amount</th>
              <th>Date Added</th>
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
                <td>₹{p.newPrice}</td>
                <td>₹{p.oldPrice}</td>
                <td>{p.discount}%</td>
                <td>₹{p.saveAmount}</td>
                 
                <td>{p.size}</td>
             
             <td>
              {p.updatedAt
                ? new Date(p.updatedAt).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                  })
                : p.createdAt
                ? new Date(p.createdAt).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                  })
                : "N/A"}
            </td>
        
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
