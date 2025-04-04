import React, { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert } from "react-bootstrap";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

function Feedback() {
  const navigate = useNavigate();
  const [rating, setRating] = useState("");
  const [enjoyedMost, setEnjoyedMost] = useState("");
  const [otherFeedback, setOtherFeedback] = useState("");
  const [wouldRecommend, setWouldRecommend] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!rating || !wouldRecommend) {
      setError("Please fill all required fields");
      return;
    }
  
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Debug: Log the token to verify it exists
      console.log("Token:", token);
      
      const response = await axios.post(
        "http://localhost:8000/feedback/",
        {
          rating: parseInt(rating),
          enjoyed_most: enjoyedMost,
          other_feedback: enjoyedMost === "Other" ? otherFeedback : "",
          would_recommend: wouldRecommend === "Yes"
        },
        {
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );
      
      console.log("Response:", response); // Debug response
      
      setSubmitted(true);
      setError("");
      setRating("");
      setEnjoyedMost("");
      setOtherFeedback("");
      setWouldRecommend("");
    } catch (err) {
      console.error("Error details:", err.response); // More detailed error logging
      setError(err.response?.data?.detail || "Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <Container className="d-flex justify-content-center align-items-center flex-grow-1">
          <div className="text-center p-4" style={{ maxWidth: "500px" }}>
            <h2 className="text-success mb-4">Thank You!</h2>
            <p>We appreciate your feedback and will use it to improve our services.</p>
            <Button variant="danger" onClick={() => navigate("/")}>
              Do Not Submit Another Feedback
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-white" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Container className="d-flex justify-content-center align-items-center flex-grow-1">
        <div className="w-100" style={{ maxWidth: "500px" }}>
          <h2 className="text-center mb-4">Customer Feedback</h2>
          <p className="text-center mb-4">We value your opinion. Please share your dining experience with us.</p>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label>Rate Your Experience (1=Poor, 5=Excellent) *</Form.Label>
              <div>
                {[1, 2, 3, 4, 5].map((num) => (
                  <Form.Check
                    key={num}
                    inline
                    type="radio"
                    id={`rating-${num}`}
                    label={num}
                    name="rating"
                    checked={rating === num.toString()}
                    onChange={() => setRating(num.toString())}
                    required
                  />
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>What did you enjoy most about your meal?</Form.Label>
              <Form.Select 
                value={enjoyedMost} 
                onChange={(e) => setEnjoyedMost(e.target.value)}
              >
                <option value="">Select an option</option>
                <option value="Taste">Taste</option>
                <option value="Presentation">Presentation</option>
                <option value="Service">Service</option>
                <option value="Ambience">Ambience</option>
                <option value="Other">Other</option>
              </Form.Select>
              {enjoyedMost === "Other" && (
                <Form.Control
                  type="text"
                  placeholder="Please specify"
                  value={otherFeedback}
                  onChange={(e) => setOtherFeedback(e.target.value)}
                  className="mt-2"
                />
              )}
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Would you recommend Jikoni Restaurant to others? *</Form.Label>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  id="recommend-yes"
                  label="Yes"
                  name="recommend"
                  checked={wouldRecommend === "Yes"}
                  onChange={() => setWouldRecommend("Yes")}
                  required
                />
                <Form.Check
                  inline
                  type="radio"
                  id="recommend-no"
                  label="No"
                  name="recommend"
                  checked={wouldRecommend === "No"}
                  onChange={() => setWouldRecommend("No")}
                />
              </div>
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 py-2"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </Button>
          </Form>
        </div>
      </Container>
    </div>
  );
}

export default Feedback;