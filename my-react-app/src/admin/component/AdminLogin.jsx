import {Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function AdminLogin() {
  const navigate = useNavigate();
  const ADMIN_EMAIL = 'admin@example.com';
  const ADMIN_PASS = 'admin@123';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      navigate("/admin/dashboard");
    }
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  return (
    <div className="admin">
      <form onSubmit={handleSubmit}>
        <div className="container">
          <h1>Login</h1>
          <div className="card2">           
            <input type="email"  id="email" name="email" placeholder="Enter email example@gmail.com"  onChange={(e) => setEmail(e.target.value)}required/>
            <input type="password" id="password" name="password" placeholder="Enter password"  onChange={(e) => setPassword(e.target.value)}  required/>
          </div>
          <button type="submit">Continue</button>
        </div>
      </form>
    </div>
  );
}

export default AdminLogin;