import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ requiresAdmin = false }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); 
  
  console.log("ProtectedRoute - Token:", token);
  console.log("ProtectedRoute - Role:", userRole);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requiresAdmin && !["admin", "manager"].includes(userRole)) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
