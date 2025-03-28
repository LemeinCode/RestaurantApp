import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Button, Row, Col, Table } from "react-bootstrap";
import Navbar from "../Navbar";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]); // Store orders

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUser(token);
    fetchOrders(token);
  }, [navigate]);

  const fetchUser = async (token) => {
    try {
      const response = await axios.get("http://localhost:8000/user/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = response.data.user;
      setUser(userData);

      // 🔹 TEMPORARY: Allow everyone to access Admin Dashboard for testing
      setIsAuthorized(true);
    } catch (error) {
      console.error("Error fetching user:", error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  // const fetchOrders = async (token) => {
  //   try {
  //     const response = await axios.get("http://localhost:8000/orders/", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setOrders(response.data);
  //   } catch (error) {
  //     console.error("Error fetching orders:", error);
  //   }
  // };

  const fetchOrders = async (token) => {
    try {
      const response = await axios.get("http://localhost:8000/admin/orders/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("📢 Orders Response:", response.data);  // Debugging log
      setOrders(response.data);
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
    }
  };
  
  return (
    <div>
      <Navbar isLoggedIn={true} />
      
      <h2 className="text-center mt-4">Admin Dashboard</h2>

      {isAuthorized && (
        <>
          {/* Admin Control Cards */}
          <Row className="justify-content-center mt-4">
            <Col md={4}>
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <Card.Title>Manage Orders</Card.Title>
                  <Button variant="primary" onClick={() => navigate("/orders")}>View Orders</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <Card.Title>Manage Users</Card.Title>
                  <Button variant="secondary" onClick={() => navigate("/users")}>View Users</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <Card.Title>Email Campaigns</Card.Title>
                  <Button variant="warning" onClick={() => navigate("/sendemails")}>Send Emails</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Orders Table */}
          <h3 className="text-center mt-5">All Orders</h3>
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Meal</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <tr key={order.id}>
                    <td>{index + 1}</td>
                    <td>{order.user_name}</td>
                    <td>{order.meal_name}</td>
                    <td>Ksh {order.price}</td>
                    <td>{order.quantity}</td>
                    <td>Ksh {order.total_price}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">No orders found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
