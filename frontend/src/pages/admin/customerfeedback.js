import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Card, Alert } from "react-bootstrap";

const CustomerFeedback = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeedback();
  }, []);

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

  return (
    <div className="p-4">
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
                              <span className="badge bg-success">Yes</span>
                            ) : (
                              <span className="badge bg-danger">No</span>
                            )}
                          </td>
                          <td>
                            {new Date(feedback.created_at).toLocaleDateString()}
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
    </div>
  );
};

export default CustomerFeedback;
