import axios from "axios";
import { storage } from "../utils/storage";

// Local Laravel API address.
// Make sure this IP matches your development PC.
export const API_BASE_URL = "http://192.168.100.6:8000/api";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
  timeout: 10000,
});

// Attach the saved Sanctum token to each request.
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

// Handle expired or invalid authentication.
export const setupResponseInterceptors = (onUnauthenticated: () => void) => {
  const interceptorId = client.interceptors.response.use(
    (response) => response,
    async (error) => {
      // A 401 means authentication is missing or invalid.
      if (error.response?.status === 401) {
        await storage.clearSession();
        onUnauthenticated();
      }

      return Promise.reject(error);
    },
  );

  // Remove the interceptor when the provider unmounts.
  return () => {
    client.interceptors.response.eject(interceptorId);
  };
};

export default client;
