import { useEffect, useState } from "react";
import axios from "axios";

function ManageContact() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    axios
      .get("https://bighaat-clone.onrender.com/contacts")
      .then((res) => setContacts(res.data))
      .catch((err) => console.log(err));
    }, []);
  
    const deleteContact = async (id) => {
    try {
      await axios.delete(`https://bighaat-clone.onrender.com/delete-contact/${id}`);
      setContacts((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Error deleting contact:", err);
    }
  };

  return (
      <div className="manage-product-card"> 
      <h2 className="manage-card-title">Manage Contacts</h2>
      <div className="manage-table-container"> 
        <table className="table table-bordered product-table"> 
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 ? (
              <tr>
                <td colSpan="5">No messages found</td>
              </tr>
            ) : (
              contacts.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.message}</td>
                  <td>
                    {new Date(c.createdAt).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                    })}
                  </td>
          
                  <td>
                    <button className="delete-btn" onClick={() => deleteContact(c._id)}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageContact;
