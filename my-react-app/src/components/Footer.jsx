import { Link } from "react-router-dom";
import "../App.css";

function Footer() {
  return (
    <>
      <footer>
        <div class="footer">
          <div class="footer-container">
            <div class="bighat-image">
              <img src="/images/bighaat-logo.webp" alt="Bighaat Logo" />
            </div>
            <div class="about-page">
              <p>
                BigHaat is one of the largest and innovative Indian full-stack
                AgriTech platforms that is dedicated to revolutionizing the
                agricultural industry in India. The platform leverages
                technology to provide a wide range of solutions and services to
                farmers, helping them optimize their agricultural practices,
                increase productivity, and ultimately improve their livelihoods.
              </p>
              <p>
                By integrating technology, data-driven insights, and a deep
                understanding of the agriculture sector, BigHaat aims to improve
                the overall agricultural ecosystem, increase farm yields, reduce
                input costs, and enhance the well-being of farmers across India.
                The platform plays a pivotal role in bridging the gap between
                technology and agriculture, ultimately contributing to the
                growth and sustainability of the agricultural sector.
              </p>
            </div>
            <div class="download-app">
              <img src="images/qrcode.webp" alt="download qr code" />
            </div>
            <div class="social-media-icons">
              <a href="#">
                <img src="images/instagram.jfif" />
              </a>
              <a href="#">
                <img src="images/facebook.png" />
              </a>
              <a href="#">
                <img src="images/youtube.png" />
              </a>
              <a href="#">
                <img src="images/x.png" />
              </a>
              <a href="#">
                <img src="images/linkedin.png" />
              </a>
            </div>
          </div>
          <div class="quick-links">
            <h2>Quick Links</h2>
            <ul>
              <li>
                <a href="#">About us</a>
              </li>
              <li>
                <a href="#">Reach Us</a>
              </li>
              <li>
                <a href="#">Media Links</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Return & Refund Policy</a>
              </li>
              <li>
                <a href="#">Terms of Service</a>
              </li>
              <li>
                <a href="#">Grievance Redressal</a>
              </li>
              <li>
                <a href="#">Careers</a>
              </li>
              <li>
                <a href="#">Shipping/Delivery Policy</a>
              </li>
              <li>
                <a href="#">FAQ</a>
              </li>
              <li>
                <a href="#">Sitemap</a>
              </li>
            </ul>
          </div>
          <div class="footer-contact">
            <h2>Contact Us</h2>
            <div class="contact-us">
              <h4>Missed Call To Order:</h4>
              <span class="call-button">1800 3000 2434</span>
              <h4>Whatsapp:</h4>
              <span class="call-button">+91 8050797979</span>
            </div>
            <div class="corporate-office">
              <h2>Corporate Office:</h2>
              <p>BigHaat Agro Pvt Ltd</p>
              <p>19/2, SKR Tower,</p>
              <p>15th Cross, 4th Phase,</p>
              <p>Dollars Layout, J.P.Nagar,</p>
              <p>Bangalore - 560078</p>
              <p>Karnataka India</p>
              <p>CIN: U74900KA2015PTC082769</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
