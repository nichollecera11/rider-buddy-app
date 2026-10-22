import axios from "axios";
import { storage } from "../utils/storage";

// Replace with your PC's IP during local dev
export const API_BASE_URL = "http://192.168.100.6:8000/api";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});

// Interceptor 1: Attach Bearer Token to outgoing requests
client.interceptors.request.use(
  async (config) => {
    const token = await storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor 2: Handle global auth failures (Token expired or user banned)
export const setupResponseInterceptors = (onUnauthenticated: () => void) => {
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        await storage.clearSession();
        onUnauthenticated();
      }
      return Promise.reject(error);
    },
  );
};

export default client;
