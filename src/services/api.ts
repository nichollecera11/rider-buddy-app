import axios from "axios";
import * as SecureStore from "expo-secure-store";

// Your local PC Wi-Fi IP and Laravel port
export const API_BASE_URL = "http://192.168.100.6:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});

// Interceptor: Automatically attach Sanctum Bearer Token to outgoing requests
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("user_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
