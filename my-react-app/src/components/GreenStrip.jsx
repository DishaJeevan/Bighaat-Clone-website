import { Link } from "react-router-dom";
import "../App.css";

function GreenStrip() {
  return (
    <div className="green-strip">
      <Link to="/sell">Sell on BigHaat</Link>
      <Link to="/bulk-orders">Bulk Order Inquiries</Link>
      <Link to="/corporate">Corporate Site</Link>
      <span className="call-btn">
        <Link to="/call-btn">Missed Call To Order: 1800-3000-2434</Link>
      </span>
    </div>
  );
}

export default GreenStrip;
