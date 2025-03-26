import axios from 'axios';

const API_URL = "http://127.0.0.1:8000/api/";

// Register User
export const registerUser = async (name, email, password) => {
  return axios.post(`${API_URL}register/`, { name, email, password });
};

// Login User
export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}login/`, { email, password });

  if (response.data.token) {
    localStorage.setItem("token", response.data.token); // Store token in localStorage
  }

  return response;
};

// Logout User
export const logoutUser = () => {
  localStorage.removeItem("token"); // Clear the token on logout
};

// Get Auth Header (for protected requests)
export const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Example of an authenticated request
export const getUserProfile = async () => {
  return axios.get(`${API_URL}profile/`, { headers: getAuthHeader() });
};
