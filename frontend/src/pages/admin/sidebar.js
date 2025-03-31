import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Nav } from "react-bootstrap";

const Sidebar = () => {
  return (
    <Container fluid>
      <Row>
        {/* Sidebar */}
        <Col md={3} className="bg-dark text-white min-vh-100 p-3">
          <h4 className="text-center mb-4">Admin Panel</h4>
          <Nav className="flex-column">
            <Nav.Item>
              <Nav.Link as={Link} to="/admin/manageorders" className="text-white">
                Manage Orders
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/admin/manageusers" className="text-white">
                Manage Users
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/admin/email-campaigns" className="text-white">
                Email Campaigns
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>

        {/* Main Content Area */}
        <Col md={9} className="p-4">
          <h2>Welcome to the Admin Dashboard</h2>
          <p>Select an option from the sidebar to manage the system.</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Sidebar;