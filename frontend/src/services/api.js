import axios from 'axios';

const API_URL = "http://127.0.0.1:8000/api/";

export const registerUser = async (name, email, password) => {
  return axios.post(`${API_URL}register/`, { name, email, password });
};

export const loginUser = async (email, password) => {
  return axios.post(`${API_URL}login/`, { email, password });
};
