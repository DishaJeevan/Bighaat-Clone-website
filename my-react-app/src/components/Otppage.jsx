import { useEffect } from "react";
import {Link} from "react-router-dom";
import { useState } from "react";
import "../App.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';


function Otppage() {

  const location = useLocation();
  const email = location.state?.email;
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [counter, setCounter] = useState(0);

  const handleVerify = async () => {

  try {

    const res = await axios.post("https://bighaat-clone.onrender.com/verify-otp", {
      email,
      otp
    });

    console.log("Response:", res.data);


    localStorage.setItem("email", res.data.email);
    localStorage.setItem("user_id", res.data.user_id);

    navigate("/");

  } catch (err) {

    setError(err.response.data.error);

    setTimeout(() => {
      setError("");
    }, 2000);

  }

};

   useEffect(() => {
    let timer;

    if (counter > 0) {
      timer = setTimeout(() => {
        setCounter(counter - 1);
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [counter]);

  const handleResend = async () => {
    try {
      await axios.post("https://bighaat-clone.onrender.com/resend-otp", { email });
      setCounter(6);   
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <div className="otp">
      <form>
        <div className="container">
          <h1>Welcome back BigHaat Farmer</h1>
          <p>Please enter the OTP you received at</p>
          <div className="email-display">
          <p>{email} <i className="fa-solid fa-pencil" onClick={() => navigate("/login")}></i></p>
        
          </div>
          <div className="card3">
            
            <input type="text" id="otp" name="otp" placeholder="Enter otp"  onChange={(e) => setOtp(e.target.value)} required />
          </div>
          <button type="button" onClick={handleVerify}>Verify</button>
          
          <div className="terms">
            By continuing you agree that you have read and accept our
            <a href="#">Terms &amp; Conditions</a> and
            <a href="#">Privacy Policy</a>
            <div className="resend-otp">

              {counter > 0 ? (
                <span style={{ color: "orange" }}> Resend OTP in {counter}</span>
             ) : (
                <button type="button" onClick={handleResend} className="resend-btn">Resend OTP</button>
              )}

            </div>
          </div>

          {error && (
              <div className="otp-error-card">
                <div className="error-icon">✖</div>
                <div className="error-text">{error}</div>
              </div>
            )}
        </div>
      </form>

      <div className="grass-logo">
        <img src="images/loginIllustration.webp" alt="alt image" />
      </div>
    </div>
  );
}

export default Otppage;
  