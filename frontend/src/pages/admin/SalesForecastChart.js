import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const SalesForecastChart = ({ apiUrl, token }) => {
  const [dailySales, setDailySales] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(apiUrl, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        // Log the raw response for debugging
        console.log("Response Status:", res.status);
        console.log("Response Content-Type:", res.headers.get("Content-Type"));
        
        // Check if response is OK (status 200-299)
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        // Read the response body as text first
        return res.text(); 
      })
      .then(text => {
        console.log("Raw response text:", text);

        try {
          // Attempt to parse the response as JSON
          const data = JSON.parse(text);
          
          if (data.dailySales) {
            setDailySales(
              data.dailySales.map(sale => ({
                date: sale.date,
                sales: sale.amount
              }))
            );
          } else {
            throw new Error('Invalid response structure: "dailySales" is missing.');
          }
        } catch (jsonError) {
          setError("Error parsing JSON: " + jsonError.message);
        }
      })
      .catch(err => {
        // Set an error message to display
        setError(err.message);
        console.error("Error fetching sales data:", err);
      });
  }, [apiUrl, token]);

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      {error ? (
        <p>{`Error: ${error}`}</p>
      ) : dailySales.length === 0 ? (
        <p>No sales data available.</p>
      ) : (
        <ResponsiveContainer width={1000} height={400}>
          <LineChart data={dailySales} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default SalesForecastChart;
