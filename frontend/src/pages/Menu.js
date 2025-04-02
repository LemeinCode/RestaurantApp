import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import Navbar from "./Navbar";

const Menu = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [menuItems, setMenuItems] = useState([]); // State for menu items
  const [quantities, setQuantities] = useState({}); // Dynamic state for quantities

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchUser(token);
      fetchMenuItems();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch logged-in user
  const fetchUser = async (token) => {
    try {
      const response = await axios.get("http://localhost:8000/user/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      navigate("/login");
    }
  };

  // Fetch menu items from the backend
  const fetchMenuItems = async () => {
    try {
      const response = await axios.get("http://localhost:8000/menu/");
      setMenuItems(response.data);
      // Initialize quantities dynamically
      const initialQuantities = response.data.reduce((acc, item) => {
        acc[item.id] = 0;
        return acc;
      }, {});
      setQuantities(initialQuantities);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  // Handle quantity changes
  const increaseQty = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const decreaseQty = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(0, prev[id] - 1) }));
  };

  // Calculate total price
  const getTotalPrice = () => {
    return menuItems.reduce((total, item) => total + item.price * quantities[item.id], 0);
  };

  // Handle order placement
  const handleOrder = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You need to be logged in to place an order.");
      navigate("/login");
      return;
    }

    const orderItems = menuItems
      .filter((item) => quantities[item.id] > 0)
      .map((item) => ({
        meal_name: item.name,
        price: Number(item.price),
        quantity: quantities[item.id],
      }));

    if (orderItems.length === 0) {
      alert("Please select at least one item to order.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/place-order/",
        { orders: orderItems },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        alert("Order placed successfully!");
        navigate("/orders", { state: { orders: orderItems, total: response.data.total } });
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} />
      <h2 className="text-center my-4">🍽️ Our Menu</h2>
      <Row className="justify-content-center mx-0">
        {menuItems.map((item) => (
          <Col key={item.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card className="text-center" style={{ width: "16rem", margin: "auto" }}>
              <Card.Img variant="top" src={item.image} alt={item.name} />
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>Price: Ksh. {item.price}</Card.Text>
                <div className="d-flex justify-content-center align-items-center mb-2">
                  <Button variant="outline-primary" size="sm" onClick={() => decreaseQty(item.id)}>
                    -
                  </Button>
                  <span className="mx-2">{quantities[item.id]}</span>
                  <Button variant="outline-primary" size="sm" onClick={() => increaseQty(item.id)}>
                    +
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <div className="text-center mt-4">
        <h4>Total Price: Ksh. {getTotalPrice()}</h4>
        <Button variant="success" onClick={handleOrder} className="mt-2">
          Place Order
        </Button>
      </div>
    </div>
  );
};

export default Menu;
