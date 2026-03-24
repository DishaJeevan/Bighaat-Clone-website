import { Link } from "react-router-dom";
import "../App.css";

function Navbar() {
  return (
    <nav>
       <div className="nav-container"></div>
      <ul className="menu">
        <li>
          <Link to="/brands">BRANDS</Link>
        </li>
        <li>
          <Link to="/seedsmenue">SEEDS</Link>
        </li>
        <li>
          <Link to="/cropprotection">CROP PROTECTION</Link>
        </li>
        <li>
          <Link to="/cropnutrition">CROP NUTRITION</Link>
        </li>
        <li>
          <Link to="/equipments">EQUIPMENTS</Link>
        </li>
        <li>
          <Link to="/animalhusbandry">ANIMAL HUSBANDRY</Link>
        </li>
        <li>
          <Link to="/organic">ORGANIC</Link>
        </li>
        <li>
          <Link to="/tapas">TAPAS</Link>
        </li>
        <li>
          <Link to="/services">SERVICES</Link>
        </li>
        <li>
          <Link to="/vedica">VEDICA</Link>
        </li>
        <li>
          <Link to="/blogs">BLOGS</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
