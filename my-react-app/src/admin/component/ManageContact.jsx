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
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 ? (
              <tr>
                <td colSpan="4">No messages found</td>
              </tr>
            ) : (
              contacts.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.message}</td>
                  <td>{new Date(c.createdAt).toLocaleString("en-IN", {timeZone: "Asia/Kolkata",})}</td>
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
