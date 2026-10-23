import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "rider_buddy_token";
const USER_KEY = "rider_buddy_user";

export const storage = {
  // Token Management
  getToken: async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  setToken: async (token: string): Promise<void> => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },
  removeToken: async (): Promise<void> => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },

  // User Session Management
  getUser: async (): Promise<any | null> => {
    try {
      const data = await SecureStore.getItemAsync(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setUser: async (user: any): Promise<void> => {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  },
  removeUser: async (): Promise<void> => {
    await SecureStore.deleteItemAsync(USER_KEY);
  },

  // Clear Entire Session
  clearSession: async (): Promise<void> => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
  },
};

export default storage;
