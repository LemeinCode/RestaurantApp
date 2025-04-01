import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ requiresAdmin = false, requiresManager = false }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); 

  console.log("ProtectedRoute - Token:", token);
  console.log("ProtectedRoute - Role:", userRole);

  if (!token) {
    return <Navigate to="/login" />;
  }

  // Prevent customers from accessing admin routes
  if (requiresAdmin && userRole === "customer") {
    return <Navigate to="/" />;
  }

  // Prevent managers from accessing the admin dashboard
  if (requiresManager && userRole === "manager") {
    return <Navigate to="/admin/manageorders" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
