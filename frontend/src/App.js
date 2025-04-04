import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from "./pages/Menu";
import Feedback from "./pages/Feedback";
import Dashboard from "./pages/admin/dashboard"; 
import Orders from "./pages/Orders";
import SendEmails from "./pages/Sendemails";
import ManageOrders from "./pages/admin/manageorders";
import ManageUsers from "./pages/admin/manageusers";
import CustomerFeedback from "./pages/admin/customerfeedback";
import Sidebar from "./pages/admin/sidebar";
import ProtectedRoute from "./ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes for logged-in users */}
        <Route element={<ProtectedRoute />}>
          <Route path="/menu" element={<Menu />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/sendemails" element={<SendEmails />} />
          <Route path="/admin/sidebar" element={<Sidebar />} />
        </Route>

        {/* Admin and Manager protected routes */}
        <Route element={<ProtectedRoute requiresAdmin={true} />}>
          <Route path="/admin/manageorders" element={<ManageOrders />} />
          <Route path="/admin/manageusers" element={<ManageUsers />} />
          <Route path="/admin/customerfeedback" element={<CustomerFeedback />} />
        </Route>

        {/* Admin only route (Managers cannot access Dashboard) */}
        <Route element={<ProtectedRoute requiresAdmin={true} requiresManager={true} />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
