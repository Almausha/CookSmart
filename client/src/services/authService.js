import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

export const registerUser = async (name, email, password) => {
  const response = await axios.post(`${API_URL}/register`, {
    name, email, password, role: 'user'
  });
  return response.data;
};

export const logoutUser = () => {
  localStorage.clear();
  window.location.href = '/';
};