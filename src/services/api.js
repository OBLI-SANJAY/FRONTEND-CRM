import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";


const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");

    if (role) config.headers["X-User-Role"] = role;
    if (email) config.headers["X-User-Email"] = email;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {

      console.error("Unauthorized! Redirecting to login...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const api = {
  get: (endpoint) => axiosInstance.get(endpoint).then(res => res.data),

  post: (endpoint, data) => {
    return axiosInstance.post(endpoint, data).then(res => {

      if (endpoint === "/auth/login") {
        return res.data;
      }
      return res.data;
    });
  },

  put: (endpoint, data) => axiosInstance.put(endpoint, data).then(res => res.data),

  patch: (endpoint, data) => axiosInstance.patch(endpoint, data).then(res => res.data),

  delete: (endpoint) => axiosInstance.delete(endpoint).then(res => res.data),
};

export default api;
