import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from "./pages/Menu";
import Dashboard from "./pages/admin/dashboard"; 
import Orders from "./pages/Orders";
import SendEmails from "./pages/Sendemails";
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
      <Route path="/orders" element={<Orders />} />
      <Route path="/sendemails" element={<SendEmails />} />
    </Route>

    {/* Admin protected route */}
    <Route element={<ProtectedRoute requiresAdmin={true} />}>
      <Route path="/dashboard" element={<Dashboard />} />
    </Route>
  </Routes>
  </Router>

  );
};

export default App;
