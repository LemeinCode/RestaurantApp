import { Link } from "react-router-dom";
import Navbar from "./Navbar";

function Home() {
  return (
    <div>
      <Navbar />
      <div className="home-container">
        <h1>Welcome to Jikoni</h1>
        <p>Experience delicious meals, freshly prepared just for you!</p>
        <Link to="/menu" className="menu-button">
          View Our Menu
        </Link>
      </div>
    </div>
  );
}

export default Home;
