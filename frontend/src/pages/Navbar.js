import React from "react";
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

function AppNavbar({ isLoggedIn }) {
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token on logout
    window.location.reload(); // Refresh page to reflect logout state
  };

  return (
    <Navbar 
      bg="white" 
      expand="lg" 
      className="py-2 border-bottom shadow-sm" 
      style={{ height: '60px' }}
    >
      <Container fluid className="px-4">
        <Navbar.Brand as={Link} to="/" className="fw-bold text-dark" style={{ fontSize: '1.5rem' }}>
          JIKONI
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {isLoggedIn ? (
              <Button variant="danger" size="sm" onClick={handleLogout}>Logout</Button>
            ) : (
              <Nav.Link as={Link} to="/login" className="me-2">
                <Button variant="outline-primary" size="sm">Login</Button>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
