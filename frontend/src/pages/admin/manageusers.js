import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Table,
  Card,
  Row,
  Col,
  Container,
  Nav,
  Alert,
} from "react-bootstrap";
import Navbar from "../Navbar";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ManageUsers = () => {
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState(null);
  const [userDetails, setUserDetails] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("users");
  const [error, setError] = useState(null);

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
      await axios.get("http://localhost:8000/user/", {
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
      const response = await axios.get(
        "http://localhost:8000/admin/user-purchase-stats/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserStats(response.data);
      setUserDetails(response.data.user_details);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      setLoading(false);
    }
  };

  const fetchFeedback = async () => {
    try {
      setFeedbackLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/admin/feedback/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedbackData(response.data.results);
    } catch (err) {
      setError("Failed to fetch feedback data");
      console.error(err);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "feedback") {
      fetchFeedback();
    }
  };

  const pieData = [
    { name: "One-time Buyers", value: userStats?.single_purchase || 0 },
    { name: "Repeat Customers", value: userStats?.multiple_purchase || 0 },
  ];

  const COLORS = ["#0088FE", "#00C49F"];

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
            {showSidebar && (
              <Col md={3} lg={2} className="bg-dark text-white min-vh-100 p-3">
                <h4 className="text-center mb-4">Admin Panel</h4>
                <Nav className="flex-column">
                  <Nav.Item>
                    <Nav.Link
                      href="#"
                      className={`text-white ${
                        activeTab === "users" ? "active" : ""
                      }`}
                      onClick={() => handleTabChange("users")}
                    >
                      Manage Users
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      href="#"
                      className={`text-white ${
                        activeTab === "feedback" ? "active" : ""
                      }`}
                      onClick={() => handleTabChange("feedback")}
                    >
                      Customer Feedback
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      href="#"
                      className="text-white"
                      onClick={() => navigate("/admin/manageorders")}
                    >
                      Manage Orders
                    </Nav.Link>
                  </Nav.Item>
                  {/* <Nav.Item>
                    <Nav.Link
                      href="#"
                      className="text-white"
                      onClick={() => navigate("/sendemails")}
                    >
                      Email Campaigns
                    </Nav.Link>
                  </Nav.Item> */}
                </Nav>
              </Col>
            )}
            <Col md={showSidebar ? 9 : 12} lg={showSidebar ? 10 : 12}>
              <div className="p-4">
                {activeTab === "users" ? (
                  <>
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
                                <div style={{ height: "400px" }}>
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
                                        label={({ name, percent }) =>
                                          `${name}: ${(percent * 100).toFixed(
                                            0
                                          )}%`
                                        }
                                      >
                                        {pieData.map((entry, index) => (
                                          <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                          />
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
                                <p>
                                  One-time Buyers: {userStats?.single_purchase || 0}
                                </p>
                                <p>
                                  Repeat Customers: {userStats?.multiple_purchase || 0}
                                </p>
                                <p>
                                  Repeat Customer Rate:{" "}
                                  {userDetails.length > 0
                                    ? (
                                        (userStats?.multiple_purchase /
                                          userDetails.length) *
                                        100
                                      ).toFixed(1) + "%"
                                    : "0%"}
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
                                      {user.order_count === 1
                                        ? "One-time"
                                        : "Repeat"}
                                      {user.order_count > 3 && " (Loyal)"}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </Card.Body>
                        </Card>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <h2 className="mb-4">Customer Feedback Results</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {feedbackLoading ? (
                      <div className="d-flex justify-content-center">
                        <div className="spinner-border" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Card className="mb-4">
                          <Card.Body>
                            <Card.Title>Feedback Summary</Card.Title>
                            <div className="d-flex flex-wrap">
                              <div className="me-4 mb-3">
                                <h5>Total Feedback:</h5>
                                <p className="fs-3">{feedbackData.length}</p>
                              </div>
                              <div className="me-4 mb-3">
                                <h5>Average Rating:</h5>
                                <p className="fs-3">
                                  {feedbackData.length > 0
                                    ? (
                                        feedbackData.reduce(
                                          (sum, item) => sum + item.rating,
                                          0
                                        ) / feedbackData.length
                                      ).toFixed(1)
                                    : 0}
                                </p>
                              </div>
                              <div className="me-4 mb-3">
                                <h5>Recommendation Rate:</h5>
                                <p className="fs-3">
                                  {feedbackData.length > 0
                                    ? `${Math.round(
                                        (feedbackData.filter(
                                          (item) => item.would_recommend
                                        ).length /
                                          feedbackData.length) *
                                          100
                                      )}%`
                                    : "0%"}
                                </p>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                        <Card>
                          <Card.Body>
                            <Card.Title>Detailed Feedback</Card.Title>
                            <div className="table-responsive">
                              <Table striped bordered hover>
                                <thead>
                                  <tr>
                                    <th>User</th>
                                    <th>Rating</th>
                                    <th>Enjoyed Most</th>
                                    <th>Comments</th>
                                    <th>Would Recommend</th>
                                    <th>Date</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {feedbackData.length > 0 ? (
                                    feedbackData.map((feedback) => (
                                      <tr key={feedback.id}>
                                        <td>
                                          {feedback.user_name}
                                          <br />
                                          <small>{feedback.user_email}</small>
                                        </td>
                                        <td>
                                          <span
                                            className={`badge ${
                                              feedback.rating >= 4
                                                ? "bg-success"
                                                : feedback.rating >= 3
                                                ? "bg-primary"
                                                : "bg-danger"
                                            }`}
                                          >
                                            {feedback.rating}/5
                                          </span>
                                        </td>
                                        <td>{feedback.enjoyed_most}</td>
                                        <td>{feedback.other_feedback || "-"}</td>
                                        <td>
                                          {feedback.would_recommend ? (
                                            <span className="badge bg-success">
                                              Yes
                                            </span>
                                          ) : (
                                            <span className="badge bg-danger">
                                              No
                                            </span>
                                          )}
                                        </td>
                                        <td>
                                          {new Date(
                                            feedback.created_at
                                          ).toLocaleDateString()}
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan="6" className="text-center">
                                        No feedback data available
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </Table>
                            </div>
                          </Card.Body>
                        </Card>
                      </>
                    )}
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