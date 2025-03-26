import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col } from 'react-bootstrap';
import axios from "axios"; // Import axios
import Navbar from "./Navbar";

const menuItems = [
  { id: 1, name: "Grilled Chicken", image: "https://via.placeholder.com/150", price: 800 },
  { id: 2, name: "Vegetable Pasta", image: "https://via.placeholder.com/150", price: 600 },
  { id: 3, name: "Beef Burger", image: "https://via.placeholder.com/150", price: 700 },
  { id: 4, name: "French Fries", image: "https://via.placeholder.com/150", price: 300 },
  { id: 5, name: "Fruit Salad", image: "https://via.placeholder.com/150", price: 500 },
  { id: 6, name: "BBQ Ribs", image: "https://via.placeholder.com/150", price: 1000 },
];

const Menu = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [quantities, setQuantities] = useState(
    menuItems.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {})
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchUser(token);
    } else {
      navigate("/login");
    }
  }, [navigate]);

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

  const increaseQty = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const decreaseQty = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(0, prev[id] - 1) }));
  };

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} />
      <h2 className="text-center my-4">🍽️ Our Menu</h2>
      <Row className="justify-content-center mx-0">
        {menuItems.map((item) => (
          <Col key={item.id} xs={12} sm={6} md={4} className="mb-4 d-flex justify-content-center">
            <Card style={{ width: '18rem' }}>
              <Card.Img variant="top" src={item.image} alt={item.name} />
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>Price: Ksh. {item.price}</Card.Text>
                <div className="d-flex justify-content-between align-items-center">
                  <Button variant="outline-primary" size="sm" onClick={() => decreaseQty(item.id)}>-</Button>
                  <span className="mx-2">{quantities[item.id]}</span>
                  <Button variant="outline-primary" size="sm" onClick={() => increaseQty(item.id)}>+</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Menu;
