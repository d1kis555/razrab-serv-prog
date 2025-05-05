import axios from "axios";

const API_URL = "http://localhost:8000"; 

export const loginAdmin = async (username, password) => {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const response = await axios.post(`${API_URL}/auth/admin/login`, formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return response.data;
};
