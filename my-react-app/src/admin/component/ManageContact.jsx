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
    <div className="manage-contact">
      <h2>Contact Messages</h2>

      <div className="table-responsive">
        <table className="dashboard-mini-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {contacts.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.message}</td>
                <td>{new Date(c.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageContact;
