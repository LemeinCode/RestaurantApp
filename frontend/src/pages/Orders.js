import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button, Table } from "react-bootstrap";
import Navbar from "./Navbar";

const Orders = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orders, total } = location.state || { orders: [], total: 0 };

  return (
    <div>
      <Navbar isLoggedIn={true} />
      <h2 className="text-center my-4">🛒 Your Order</h2>
      {orders.length > 0 ? (
        <div className="container">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Meal</th>
                <th>Price (Ksh)</th>
                <th>Quantity</th>
                <th>Total (Ksh)</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{order.meal_name}</td>
                  <td>{order.price}</td>
                  <td>{order.quantity}</td>
                  <td>{order.price * order.quantity}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <h4 className="text-center mt-3">Grand Total: Ksh. {total}</h4>
          <div className="text-center">
            <Button variant="primary" onClick={() => navigate("/")}>
              Order More
            </Button>
          </div>
        </div>
      ) : (
        <h4 className="text-center">No orders placed.</h4>
      )}
    </div>
  );
};

export default Orders;
