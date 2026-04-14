import axios from "axios";
import { VITE_API_URL } from "../constants/API_URL";

export const apiClient = axios.create({
  baseURL: VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // needed since backend has credentials: true
});

// runs before every request — always picks up the latest token
apiClient.interceptors.request.use((config) => {
  const raw = localStorage.getItem("token");
  const parsed = raw ? JSON.parse(raw) : null;
  const token = parsed?.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// handles expired tokens globally
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("token");
//       window.location.href = "/auth/login"; // redirect to login on token expiry
//     }
//     return Promise.reject(error);
//   }
// );