import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { COLORS } from "../constants/theme";
import { AuthProvider, useAuth } from "../context/AuthContext";

// Prevent splash screen from hiding before auth state hydration and font loading
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { token, isInitializing } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Load Plus Jakarta Sans font weights
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    // Wait until both auth session is restored and fonts are loaded
    if (isInitializing || !fontsLoaded) return;

    // Hide splash screen smoothly
    SplashScreen.hideAsync();

    const inAuthGroup = segments[0] === "(auth)";

    if (!token && !inAuthGroup) {
      // Redirect to login if user is unauthenticated
      router.replace("/(auth)/login");
    } else if (token && inAuthGroup) {
      // Redirect to main tabs if already logged in
      router.replace("/(tabs)");
    }
  }, [token, isInitializing, fontsLoaded, segments]);

  // Keep splash screen active while preparing
  if (isInitializing || !fontsLoaded) {
    return null;
  }

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
