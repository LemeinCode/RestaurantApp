import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Row, Col, Container, Nav } from "react-bootstrap";
import Navbar from "../Navbar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,Cell, BarChart, Bar } from 'recharts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [topMeals, setTopMeals] = useState([]);  // New state for top meals
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
    fetchTopMeals(token);  // Fetch top meals data
  }, [navigate]);

  const fetchUser = async (token) => {
    try {
      const response = await axios.get("http://localhost:8000/user/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = response.data.user;
      setUser(userData);
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
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchDashboardStats = async (token) => {
    try {
      const response = await axios.get("http://localhost:8000/admin/dashboard-stats/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboardStats(response.data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      setDashboardStats({
        totalSales: calculateTotalSales(orders),
        activeUsers: new Set(orders.map(order => order.user_name)).size,
        totalOrders: orders.length,
        dailySales: generateDailySales(orders)
      });
    }
  };

  const fetchTopMeals = async (token) => {
    try {
      const response = await axios.get("http://localhost:8000/admin/top-three-meals/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Top meals data:", response.data);  // Check if the data is correct
      setTopMeals(response.data);
    } catch (error) {
      console.error("Error fetching top meals:", error);
    }
  };
  
  
  const calculateTotalSales = (ordersList) => {
    return ordersList.reduce((sum, order) => sum + parseFloat(order.total_price), 0).toFixed(2);
  };

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
                      <LineChart
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
                        <Tooltip formatter={(value) => [`KES ${value}`, 'Sales']} />
                        <Legend />
                        <Line type="monotone" dataKey="amount" stroke="#8884d8" />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card.Body>
                </Card>

                {/* Top Meals Bar Chart */}
                  <Card className="shadow-sm mb-4">
                    <Card.Body>
                      <h3 className="mb-4">Top 3 Meals</h3>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                          data={topMeals}
                          margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="mealName" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar 
                            dataKey="salesCount" 
                            name="Sales Count"
                            label={{ position: 'top' }}
                            barSize={60}
                          >
                            {topMeals.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={
                                  index === 0 ? '#8884d8' :  // First meal - purple
                                  index === 1 ? '#82ca9d' :  // Second meal - green
                                  '#ff8042'                 // Third meal - orange
                                } 
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
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
