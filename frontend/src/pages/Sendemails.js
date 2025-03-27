import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import axios from "axios";

const SendEmails = () => {
  const [emailContent, setEmailContent] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSendEmail = async () => {
    if (!emailContent.trim()) {
      setError("Please enter the email content.");
      return;
    }

    setError("");
    setMessage("Sending email...");

    try {
      // 🔹 Django will fetch recipient emails from the database
      const response = await axios.post("http://localhost:8000/send-email/", {
        email_body: emailContent,
      });

      console.log("Response:", response.data);
      setMessage("Email sent successfully to all registered users!");
      setEmailContent(""); // Clear input after sending
    } catch (err) {
      console.error("Error sending email:", err);
      setError("Failed to send email.");
    }
  };

  return (
    <Container
      className="mt-4 p-4 shadow-lg rounded"
      style={{ maxWidth: "900px", minHeight: "400px", backgroundColor: "#f8f9fa" }}
    >
      <h2 className="mb-4 text-center">Send Email to All Users</h2>

      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form>
        <Form.Group className="mb-4">
          <Form.Label className="fw-bold">Email Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={10} // 🔹 Bigger text area
            placeholder="Type the email content here..."
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            style={{
              fontSize: "1.1rem",
              padding: "10px",
              width: "100%", // 🔹 Makes the text area full width
              resize: "vertical", // 🔹 Allows vertical resizing only
            }}
          />
        </Form.Group>

        <div className="d-grid">
          <Button variant="primary" size="lg" onClick={handleSendEmail}>
            Send Email
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default SendEmails;
