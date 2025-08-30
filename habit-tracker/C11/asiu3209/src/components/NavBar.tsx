import { Link } from "react-router-dom";


function NavBar() {
  return (
    <nav className="nav">
      <Link className="nav-link" to="/">
        Home
      </Link>
      <Link className="nav-link" to="/statistics">
        Statistics
      </Link>
    </nav>
  );
}

export default NavBar;
