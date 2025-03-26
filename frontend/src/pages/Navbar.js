import { Link } from "react-router-dom";


function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="logo">Jikoni</h1>
      <Link to="/login" className="login-button">
        Login
      </Link>
    </nav>
  );
}

export default Navbar;
