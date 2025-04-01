import React from "react";
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

function AppNavbar({ isLoggedIn, toggleSidebar, showSidebar, isAdminPage }) {
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
        {/* Only show the sidebar toggle on admin pages */}
        {isAdminPage && (
          <div 
            onClick={toggleSidebar}
            style={{ cursor: 'pointer', padding: '0.5rem' }}
            className="me-2"
          >
            {showSidebar ? (
              // X icon when sidebar is open
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            ) : (
              // Hamburger icon when sidebar is closed
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
              </svg>
            )}
          </div>
        )}
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