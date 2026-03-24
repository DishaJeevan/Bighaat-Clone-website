import {useState} from "react";
import {Link} from "react-router-dom";
import "../App.css";
import axios from 'axios';
import validator from "validator";
import { useNavigate } from "react-router-dom";
import {useEffect} from "react";

 
function Login() {

   const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState("");
  const [savedEmail, setSavedEmail] = useState("");
  

   useEffect(() => {
    const lastEmail = localStorage.getItem("lastLoginEmail");
    if (lastEmail) {
      setSavedEmail(lastEmail);
    }
  }, []);

  const validateEmail = (value) => {
    if (!validator.isEmail(value)) {
      setEmailError("Enter valid Email!");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };
 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateEmail(email)) return;
  try {
    await axios.post("https://bighaat-clone.onrender.com/login", { email });
    navigate("/otp", { state: { email } });
  } catch (err) {
    console.log(err.response?.data);
  }
};

const handleSavedLogin = () => {
  navigate("/");
};

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <div className="container">
          {savedEmail && (
          <div className="saved-login">
           <button type="button" className="saved-button" style={{ backgroundColor: "#2563eb", color: "white" }}  onClick={handleSavedLogin}>
              Login with {savedEmail} <p>Powered by kwik pass</p>
            </button>
            
          </div>
        )}

          <h1>Login</h1>

          <div className="card2">
            
            <input type="email"  id="email" name="email" placeholder="Enter email example@gmail.com"  onChange={(e) => {
                setEmail(e.target.value);
               validateEmail(e.target.value);
              }}
              required
            />
            
          </div>
          <button type="submit">Continue</button>
          
          <div class="terms">
            By continuing you agree that you have read and accept our
            <a href="#">Terms &amp; Conditions</a> and
            <a href="#">Privacy Policy</a>
          </div>
        </div>
      </form>

      <div class="grass-logo">
        <img src="images/loginIllustration.webp" alt="alt image" />
      </div>
    </div>
  );
}

export default Login;