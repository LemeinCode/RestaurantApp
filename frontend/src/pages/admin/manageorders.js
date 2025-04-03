import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Table, Button, Form, Container, Row, Col, Nav } from "react-bootstrap";
import Navbar from "../Navbar";

const ManageOrders = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [newItem, setNewItem] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    category: "meat",
    available: true,
    inventory: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUser(token);
    fetchMenuItems();
  }, [navigate]);

  const fetchUser = async (token) => {
    try {
      const response = await axios.get("http://localhost:8000/user/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsAuthorized(true);
    } catch (error) {
      console.error("Error fetching user:", error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get("http://localhost:8000/menu/");
      setMenuItems(response.data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewItem({
      ...newItem,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      try {
        const response = await axios.put(`http://localhost:8000/menu/edit/${newItem.id}/`, newItem);
        setMenuItems(menuItems.map(item => item.id === newItem.id ? response.data : item));
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating item:", error);
      }
    } else {
      try {
        const response = await axios.post("http://localhost:8000/menu/add/", newItem);
        setMenuItems([...menuItems, response.data]);
      } catch (error) {
        console.error("Error adding item:", error);
      }
    }
    setNewItem({ id: "", name: "", description: "", price: "", category: "meat", available: true, inventory: 0 });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/menu/delete/${id}/`);
      setMenuItems(menuItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleEdit = (item) => {
    setNewItem(item);
    setIsEditing(true);
  };

  return (
    <div>
      <Navbar 
        isLoggedIn={true} 
        toggleSidebar={toggleSidebar} 
        showSidebar={showSidebar} 
        isAdminPage={true} 
      />
      {isAuthorized && (
        <Container fluid>
          <Row>
            {/* Sidebar */}
            {showSidebar && (
              <Col md={3} lg={2} className="bg-dark text-white min-vh-100 p-3">
                <h4 className="text-center mb-4">Admin Panel</h4>
                <Nav className="flex-column">
                  <Nav.Item>
                    <Nav.Link href="#" className="text-white" onClick={() => navigate("/admin/manageorders")}>
                      Manage Orders
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link href="#" className="text-white" onClick={() => navigate("/admin/manageusers")}>
                      Manage Users
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link href="#" className="text-white" onClick={() => navigate("/sendemails")}>
                      Email Campaigns
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
            )}
            {/* Main Content */}
            <Col md={showSidebar ? 9 : 12} lg={showSidebar ? 10 : 12}>
              <div className="p-4">
                <h2 className="text-center mb-4">📋 Manage Menu Items</h2>

                <Form onSubmit={handleSubmit} className="mb-4">
                  <Form.Group controlId="name">
                    <Form.Label>Food Name</Form.Label>
                    <Form.Control type="text" name="name" value={newItem.name} onChange={handleChange} required />
                  </Form.Group>

                  <Form.Group controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" name="description" value={newItem.description} onChange={handleChange} />
                  </Form.Group>

                  <Form.Group controlId="price">
                    <Form.Label>Price (Ksh)</Form.Label>
                    <Form.Control type="number" name="price" value={newItem.price} onChange={handleChange} required />
                  </Form.Group>

                  <Form.Group controlId="category">
                    <Form.Label>Category</Form.Label>
                    <Form.Control as="select" name="category" value={newItem.category} onChange={handleChange}>
                      <option value="meat">Meat</option>
                      <option value="carbs">Carbohydrates</option>
                      <option value="vegetables">Vegetables</option>
                      <option value="beverage">Beverage</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group controlId="inventory">
                    <Form.Label>Inventory</Form.Label>
                    <Form.Control type="number" name="inventory" value={newItem.inventory} onChange={handleChange} />
                  </Form.Group>

                  <Form.Group controlId="available" className="mb-3">
                    <Form.Check type="checkbox" label="Available" name="available" checked={newItem.available} onChange={handleChange} />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="mt-3">
                    {isEditing ? "Update Item" : "Add Item"}
                  </Button>
                </Form>

                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Price (Ksh)</th>
                      <th>Category</th>
                      <th>Available</th>
                      <th>Inventory</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.length > 0 ? (
                      menuItems.map((item) => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{item.name}</td>
                          <td>{item.description}</td>
                          <td>Ksh. {item.price}</td>
                          <td>{item.category}</td>
                          <td>{item.available ? "✅" : "❌"}</td>
                          <td>{item.inventory}</td>
                          <td>
                            <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>
                              Delete
                            </Button>
                            <Button variant="warning" size="sm" onClick={() => handleEdit(item)} className="ms-2">
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center">No menu items available</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
};

export default ManageOrders;