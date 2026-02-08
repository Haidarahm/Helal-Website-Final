import axios from "axios";

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens or other headers here if needed
    const token = localStorage.getItem("token"); // Example: get auth token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors here
    if (error.response) {
      const status = error.response.status;
      // 401 Unauthorized or 403 Forbidden: logout and clear storage
      if (status === 401 || status === 403) {
        try {
          import("../store/authStore.js").then((m) => {
            m.default.getState().logout();
          }).catch(() => {});
          localStorage.clear();
          sessionStorage.clear();
        } catch (_) {
          // ignore storage errors
        }
        if (typeof window !== "undefined" && window.location) {
          const currentPath = window.location.pathname || "";
          if (!currentPath.toLowerCase().includes("auth")) {
            window.location.href = "/auth";
          }
        }
      }
      console.error("API Error:", status, error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error("Network Error:", error.request);
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
