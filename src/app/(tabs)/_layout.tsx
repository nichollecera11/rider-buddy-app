import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { COLORS } from "../../constants/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.accentPurple,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: "absolute",
          left: 16,
          right: 16,
          bottom: Platform.OS === "ios" ? 18 : 12,
          height: 66,
          paddingTop: 8,
          paddingBottom: 8,
          backgroundColor: COLORS.cardWhite,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: COLORS.borderLight,
          borderRadius: 22,
          elevation: 10,
          shadowColor: "#281137",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
          marginTop: 2,
        },
        tabBarItemStyle: {
          borderRadius: 16,
          marginHorizontal: 3,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={23}
              color={String(color ?? "#77717C")}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="garage"
        options={{
          title: "Garage",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "bicycle" : "bicycle-outline"}
              size={23}
              color={String(color ?? "#77717C")}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="requests"
        options={{
          title: "Requests",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "construct" : "construct-outline"}
              size={23}
              color={String(color ?? "#77717C")}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Account",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={23}
              color={String(color ?? "#77717C")}
            />
          ),
        }}
      />

      {/* SOS form remains accessible through its existing route. */}
      <Tabs.Screen name="consults" options={{ href: null }} />

      {/* Keep Shop available without showing it in the tab bar. */}
      <Tabs.Screen name="shop" options={{ href: null }} />
    </Tabs>
  );
}
