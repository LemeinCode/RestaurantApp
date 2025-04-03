import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Table, Button, Card, Row, Col, Container, Nav } from "react-bootstrap";
import Navbar from "../Navbar";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ManageUsers = () => {
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState(null);
  const [userDetails, setUserDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUser(token);
    fetchUserStats(token);
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

  const fetchUserStats = async (token) => {
    try {
      const response = await axios.get("http://localhost:8000/admin/user-purchase-stats/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserStats(response.data);
      setUserDetails(response.data.user_details);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      setLoading(false);
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const pieData = [
    { name: 'One-time Buyers', value: userStats?.single_purchase || 0 },
    { name: 'Repeat Customers', value: userStats?.multiple_purchase || 0 }
  ];

  const COLORS = ['#0088FE', '#00C49F'];

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
                <h2 className="mb-4">Customer Purchase Statistics</h2>
                
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <>
                    <Row className="mb-4">
                      <Col md={6}>
                        <Card>
                          <Card.Body>
                            <Card.Title>Customer Purchase Frequency</Card.Title>
                            <div style={{ height: '400px' }}>
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={150}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                  >
                                    {pieData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip />
                                  <Legend />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={6}>
                        <Card>
                          <Card.Body>
                            <Card.Title>Statistics</Card.Title>
                            <p>Total Customers: {userDetails.length}</p>
                            <p>One-time Buyers: {userStats?.single_purchase || 0}</p>
                            <p>Repeat Customers: {userStats?.multiple_purchase || 0}</p>
                            <p>Repeat Customer Rate: {userDetails.length > 0 
                              ? ((userStats?.multiple_purchase / userDetails.length) * 100).toFixed(1) + '%' 
                              : '0%'}
                            </p>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>

                    <Card className="mb-4">
                      <Card.Body>
                        <Card.Title>All Customers</Card.Title>
                        <Table striped bordered hover responsive>
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Orders Placed</th>
                              <th>Customer Type</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userDetails.map((user, index) => (
                              <tr key={index}>
                                <td>{user.user__name}</td>
                                <td>{user.user__email}</td>
                                <td>{user.order_count}</td>
                                <td>
                                  {user.order_count === 1 ? 'One-time' : 'Repeat'}
                                  {user.order_count > 3 && ' (Loyal)'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Card.Body>
                    </Card>
                  </>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
};

export default ManageUsers;