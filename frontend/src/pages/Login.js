import React, { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert } from "react-bootstrap";
import Navbar from "./Navbar";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

//   const handleLogin = async (e) => {

//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         "http://localhost:8000/login/",
//         { email, password },
//         { headers: { "Content-Type": "application/json" } }
//       );

//       console.log("Response from server:", response.data); // Debugging

//       if (response.data.token) {
//         localStorage.setItem("token", response.data.token); // Save token
//         alert(response.data.message);
//         window.location.href = "/"; // Reload to reflect login state
//       } else {
//         setError("Invalid response from server");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       setError(error.response?.data?.error || "Login failed");
//     }
//   };

const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/login/",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
  
      console.log("Full response from server:", response); // Debugging
  
      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        alert(response.data.message);
        window.location.href = "/";
      } else {
        console.error("Unexpected response structure:", response.data);
        setError("Invalid response from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.error || "Login failed");
    }
  };
  

  return (
    <div className="bg-white" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Container className="d-flex justify-content-center align-items-center flex-grow-1">
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <h2 className="text-center mb-4 fw-bold" style={{ color: "#333" }}>Login to Your Account</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="py-2 border-0 border-bottom"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="py-2 border-0 border-bottom"
              />
              <div className="d-flex justify-content-end mt-2">
                <a href="/forgot-password" className="text-muted" style={{ fontSize: "0.8rem" }}>
                  Forgot Password?
                </a>
              </div>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 py-2 mt-3">
              Login
            </Button>

            <div className="text-center mt-3">
              Don't have an account? <a href="/register" className="text-primary">Register</a>
            </div>
          </Form>
        </div>
      </Container>
    </div>
  );
}

export default Login;
