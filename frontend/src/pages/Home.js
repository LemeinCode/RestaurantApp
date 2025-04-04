import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Container, Button } from 'react-bootstrap';
import axios from "axios"; // Import axios
import Navbar from "./Navbar";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // Store user details

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchUser(token);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const response = await axios.get("http://localhost:8000/user/", {
        headers: { Authorization: `Bearer ${token}` }, // Send token
      });
      setUser(response.data.user); // Store user data
    } catch (error) {
      console.error("Error fetching user:", error);
      localStorage.removeItem("token"); // Remove invalid token
      setIsLoggedIn(false);
    }
  };

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} />
      <Container className="text-center mt-5">
        <h1 className="display-4 mb-4">Welcome to Jikoni</h1>
        
        {isLoggedIn ? (
          <>
            <h2>Hi {user ? user.name : "Guest"}!</h2>
            <p className="lead mb-4">Explore our menu and place your order now!</p>
            <Link to="/menu">
              <Button variant="primary" size="lg">View Our Menu</Button>
            </Link>
            <Link to="/feedback">
              <Button variant="warning" size="lg">Feedback</Button>
            </Link>
          </>
        ) : (
          <>
            <p className="lead mb-4">Sign in to explore our menu and place your order!</p>
            <Link to="/login">
              <Button variant="outline-primary" size="lg">Login</Button>
            </Link>
          </>
        )}
      </Container>
    </div>
  );
}

export default Home;
