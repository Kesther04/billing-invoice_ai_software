import axios from "axios";
import { VITE_API_URL } from "../constants/API_URL";
import { clearAccessToken, getAccessToken, setAccessToken } from "../constants/tokenStore";

export const apiClient = axios.create({
  baseURL: VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // needed since backend has credentials: true
});

// runs before every request — always picks up the latest token
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// handles expired tokens globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't try to refresh the refresh request
    if (originalRequest.url === "/auth/refresh") {
        clearAccessToken();
        return Promise.reject(error);
    }


    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const response = await apiClient.post("/auth/refresh");

        setAccessToken(response.data.data.accessToken);

        originalRequest.headers.Authorization =
          `Bearer ${response.data.data.accessToken}`;

        return apiClient(originalRequest);
      } catch {
        clearAccessToken();
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  }
);