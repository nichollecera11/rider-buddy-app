import React, { createContext, useContext, useEffect, useState } from "react";
import client, { setSessionEndedHandler } from "../api/client";

import storage from "../utils/storage";

interface AuthContextType {
  user: any | null;
  token: string | null;
  loading: boolean;
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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setSessionEndedHandler(() => {
      setToken(null);
      setUser(null);
    });
    restoreSession();
    return () => setSessionEndedHandler(null);
  }, []);

  const restoreSession = async () => {
    try {
      const storedToken = await storage.getToken();
      const storedUser = await storage.getUser();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }
    } catch (e) {
      console.error("Failed to restore session:", e);
    } finally {
      setLoading(false);
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
      value={{
        user,
        token,
        loading,
        isInitializing: loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
