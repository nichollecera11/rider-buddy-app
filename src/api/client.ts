import axios from "axios";
import { storage } from "../utils/storage";

// Use your PC's IPv4 address (run `ipconfig`) and the port Laravel runs on.
// If your PC reconnects to the Wi-Fi and the address changes, this is the one line to edit.
export const API_BASE_URL = "http://192.168.100.6:8000/api";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});

// Attach the Bearer token to every outgoing request
client.interceptors.request.use(async (config) => {
  const token = await storage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// AuthContext registers a function here that clears its state and sends the user to login.
// It is set and cleared in one place, so it can never pile up during hot reloads.
let onSessionEnded: (() => void) | null = null;

export function setSessionEndedHandler(handler: (() => void) | null) {
  onSessionEnded = handler;
}

// Registered once, at module level

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("[API ERROR DETAILS]", {
      method: error.config?.method,
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });

    const status: number | undefined = error.response?.status;
    const message: string = String(error.response?.data?.message ?? "");
    const isLoginCall = String(error.config?.url ?? "").includes("/login");

    const sessionEnded =
      !isLoginCall &&
      (status === 401 ||
        (status === 403 && message.toLowerCase().includes("banned")));

    if (sessionEnded) {
      await storage.clearSession();
      onSessionEnded?.();
    }

    return Promise.reject(error);
  },
);

export default client;
