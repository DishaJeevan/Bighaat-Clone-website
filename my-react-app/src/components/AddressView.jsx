import { useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function AddressView() {
const navigate = useNavigate();
  const [address, setAddress] = useState(null);
    const [loading, setLoading] = useState(true);


  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await axios.get(
          `https://bighaat-clone.onrender.com/get-address/${user_id}`
        );
        setAddress(res.data);
      } catch (err) {
        console.log(err);
      }
        finally {
        setLoading(false); 
      }
    };
    fetchAddress();
    }, [user_id]);

    
    // const handleUpdate = () => fetchAddress();
    // window.addEventListener("address_updated", handleUpdate);

    // return () => window.removeEventListener("address_updated", handleUpdate);
  // , [user_id]
 if (loading) {
    return <p>Loading address...</p>;
  }

  if (!address || !address.name) {
    return <p>No address found</p>;
  }
  

  return(

<div className="address-card">
  <h3> Your Details</h3>
    <p><strong>Name:</strong>{address.name}</p>

    <p><strong>Phone:</strong> {address.phone}</p>

    <p> <strong>Flat:</strong>{address.flat}</p>
     
       <p><strong>Street:</strong>{address.street}</p>
    

    <p><strong>City:</strong> {address.city}</p>
     <p><strong>District: </strong>{address.district}</p>
    

    <p><strong>Address:</strong>
      {address.state} - {address.pincode}
    </p>

    {address.landmark && (
      <p><strong>Landmark:</strong> {address.landmark}</p>
    )}

    <div className="address-buttons">
      <button onClick={() => navigate("/checkout-address")}>
        Move to Checkout
      </button>

      <button
        onClick={() =>
          navigate("/edit-address", { state: { address } })
        }
      >
        Edit Address
      </button>
    </div>
  </div>
);
}

export default AddressView;
