import { Link } from "react-router-dom";

function Header() {
  return (
     <header className="navbar">
      <div className="logo">InApp Support</div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          
        </ul>
      </nav>
    </header>
  );
}
export default Header;