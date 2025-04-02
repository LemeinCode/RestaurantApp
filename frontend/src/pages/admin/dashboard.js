import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Button, Row, Col, Table, Container, Nav } from "react-bootstrap";
import Navbar from "../Navbar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalSales: 0,
    activeUsers: 0,
    totalOrders: 0,
    dailySales: []
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUser(token);
    fetchOrders(token);
    fetchDashboardStats(token);
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

  const fetchOrders = async (token) => {
    try {
      const response = await axios.get("http://localhost:8000/admin/orders/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("📢 Orders Response:", response.data); // Debugging log
      setOrders(response.data);
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
    }
  };

  const fetchDashboardStats = async (token) => {
    try {
      const response = await axios.get("http://localhost:8000/admin/dashboard-stats/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("📊 Dashboard Stats:", response.data); // Debugging log
      setDashboardStats(response.data);
    } catch (error) {
      console.error("❌ Error fetching dashboard stats:", error);
      // Set sample data if API fails
      setDashboardStats({
        totalSales: calculateTotalSales(orders),
        activeUsers: new Set(orders.map(order => order.user_name)).size,
        totalOrders: orders.length,
        dailySales: generateDailySales(orders)
      });
    }
  };

  // Fallback calculation if API fails
  const calculateTotalSales = (ordersList) => {
    return ordersList.reduce((sum, order) => sum + parseFloat(order.total_price), 0).toFixed(2);
  };

  // const generateDailySales = (ordersList) => {
  //   const salesByDate = {};
    
  //   ordersList.forEach(order => {
  //     const date = new Date(order.created_at).toLocaleDateString();
  //     if (!salesByDate[date]) {
  //       salesByDate[date] = 0;
  //     }
  //     salesByDate[date] += parseFloat(order.total_price);
  //   });
    
  //   return Object.entries(salesByDate).map(([date, amount]) => ({
  //     date,
  //     amount: parseFloat(amount.toFixed(2))
  //   }));
  // };

  const generateDailySales = (ordersList) => {
    let minDate, maxDate;
    if (ordersList.length > 0) {
      minDate = new Date(Math.min(...ordersList.map(order => new Date(order.created_at))));
      maxDate = new Date(Math.max(...ordersList.map(order => new Date(order.created_at))));
    } else {
      maxDate = new Date();
      minDate = new Date();
      minDate.setDate(minDate.getDate() - 7);
    }
  
    const salesByDate = {};
    let currentDate = new Date(minDate);
    while (currentDate <= maxDate) {
      const dateString = currentDate.toLocaleDateString();
      salesByDate[dateString] = 0;
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    ordersList.forEach(order => {
      const date = new Date(order.created_at).toLocaleDateString();
      salesByDate[date] += parseFloat(order.total_price);
    });
  
    return Object.entries(salesByDate).map(([date, amount]) => ({
      date,
      amount: parseFloat(amount.toFixed(2))
    }));
  };
  

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div>
      {/* Main Navbar with hamburger menu */}
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
                <h2 className="mb-4">Admin Dashboard</h2>
                
                {/* Admin Control Cards */}
                <Row className="mb-4">
                  <Col md={4}>
                    <Card className="shadow-sm h-100">
                      <Card.Body className="d-flex flex-column">
                        <Card.Title>Total Sales</Card.Title>
                        <div className="text-center my-auto">
                          <h2 className="text-success">KES {dashboardStats.totalSales || "0.00"}</h2>
                        </div>
                        <Card.Text className="text-muted mt-auto">
                          Total revenue generated from all orders
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  
                  <Col md={4}>
                    <Card className="shadow-sm h-100">
                      <Card.Body className="d-flex flex-column">
                        <Card.Title>Active Customers</Card.Title>
                        <div className="text-center my-auto">
                          <h2 className="text-primary">{dashboardStats.activeUsers || 0}</h2>
                        </div>
                        <Card.Text className="text-muted mt-auto">
                          Number of unique customers who placed orders
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  
                  <Col md={4}>
                    <Card className="shadow-sm h-100">
                      <Card.Body className="d-flex flex-column">
                        <Card.Title>Total Orders</Card.Title>
                        <div className="text-center my-auto">
                          <h2 className="text-warning">{dashboardStats.totalOrders || 0}</h2>
                        </div>
                        <Card.Text className="text-muted mt-auto">
                          Number of orders processed in total
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                
                {/* Sales Graph - Line Chart */}
                <Card className="shadow-sm mb-4">
                  <Card.Body>
                    <h3 className="mb-4">Daily Sales Trend</h3>
                    <ResponsiveContainer width="100%" height={400}>
                      {
                        <BarChart 
                          data={dashboardStats.dailySales || []}
                          margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="date" 
                            angle={-45} 
                            textAnchor="end" 
                            height={80}
                          />
                          <YAxis label={{ value: 'Sales (KES)', angle: -90, position: 'insideLeft' , dx: -20 }} />
                          <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                          <Legend />
                          <Bar 
                            dataKey="amount" 
                            name="Daily Sales" 
                            fill="#8884d8"
                          />
                        </BarChart>

                      }

                    </ResponsiveContainer>
                  </Card.Body>
                </Card>
                
                {/* Recent Orders Table */}
                <Card className="shadow-sm">
                  <Card.Body>
                    <h3 className="mb-4">Recent Orders</h3>
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Meal</th>
                          <th>Quantity</th>
                          <th>Total</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.user_name}</td>
                            <td>{order.meal_name}</td>
                            <td>{order.quantity}</td>
                            <td>KES {parseFloat(order.total_price).toFixed(2)}</td>
                            <td>{new Date(order.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                        {orders.length === 0 && (
                          <tr>
                            <td colSpan={6} className="text-center">No orders found</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                    {orders.length > 5 && (
                      <div className="text-center mt-3">
                        <Button variant="primary" onClick={() => navigate("/orders")}>
                          View All Orders
                        </Button>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
};

export default AdminDashboard;