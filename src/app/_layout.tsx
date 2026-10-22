import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { COLORS } from "../constants/theme";
import { AuthProvider, useAuth } from "../context/AuthContext";

// Prevent splash screen from hiding before auth state hydration
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { token, isInitializing } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isInitializing) return;

    // Hide splash screen once auth check finishes
    SplashScreen.hideAsync();

    const inAuthGroup = segments[0] === "(auth)";

    if (!token && !inAuthGroup) {
      // Redirect to login if user is unauthenticated
      router.replace("/(auth)/login");
    } else if (token && inAuthGroup) {
      // Redirect to main tabs if already logged in
      router.replace("/(tabs)");
    }
  }, [token, isInitializing, segments]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.bgDark },
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
