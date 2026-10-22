import React, { createContext, useContext, useEffect, useState } from "react";
import client, { setupResponseInterceptors } from "../api/client";
import { storage } from "../utils/storage";

interface AuthContextType {
  user: any | null;
  token: string | null;
  isInitializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  useEffect(() => {
    // Register auto-logout on 401/403 API response
    setupResponseInterceptors(() => {
      setToken(null);
      setUser(null);
    });

    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const savedToken = await storage.getToken();
      const savedUser = await storage.getUser();

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(savedUser);
      }
    } catch (e) {
      console.error("Session restore failed", e);
    } finally {
      setIsInitializing(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await client.post("/login", { email, password });
    const { token: userToken, user: userData } = response.data;

    await storage.setToken(userToken);
    await storage.setUser(userData);

    setToken(userToken);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await client.post("/logout");
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      await storage.clearSession();
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isInitializing, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
