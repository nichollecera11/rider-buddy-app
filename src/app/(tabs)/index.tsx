import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { styles } from "../../styles/home.styles";

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const actions = [
    {
      id: "consult",
      title: "Consult",
      icon: "chatbubbles",
      color: "#FF6600",
      route: "/(tabs)/consults",
    },
    {
      id: "garage",
      title: "Garage",
      icon: "bicycle",
      color: "#00E5FF",
      route: "/(tabs)/garage",
    },
    {
      id: "lto",
      title: "LTO Butler",
      icon: "document-text",
      color: "#4CAF50",
      route: "/(tabs)/garage",
    },
    {
      id: "shop",
      title: "Parts Shop",
      icon: "cart",
      color: "#E91E63",
      route: "/(tabs)/shop",
    },
    {
      id: "mechanics",
      title: "Mechanics",
      icon: "build",
      color: "#FF9800",
      route: "/(tabs)/consults",
    },
    {
      id: "logs",
      title: "Logs",
      icon: "time",
      color: "#9C27B0",
      route: "/(tabs)/garage",
    },
    {
      id: "roadside",
      title: "Emergency",
      icon: "warning",
      color: "#F44336",
      route: "/(tabs)/consults",
    },
    {
      id: "more",
      title: "More",
      icon: "apps",
      color: "#607D8B",
      route: "/(tabs)/profile",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Bar Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>MAAYONG BUNTAG 🇵🇭</Text>
            <Text style={styles.userName}>{user?.name || "Rider"}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color={COLORS.textPrimary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Motorcycle Switcher Card */}
        <TouchableOpacity
          style={styles.bikeSelectorCard}
          onPress={() => router.push("/(tabs)/garage")}
        >
          <View style={styles.bikeInfo}>
            <Ionicons name="bicycle" size={24} color={COLORS.primary} />
            <View>
              <Text style={styles.bikeName}>Yamaha NMAX 155</Text>
              <Text style={styles.bikePlate}>Plate: ABC 1234 • 12,450 km</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>

        {/* Hero LTO Compliance Status Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroTop}>
            <Text style={styles.heroTitle}>🛡️ LTO Compliance Guardian</Text>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>VALID</Text>
            </View>
          </View>
          <Text style={styles.heroSubtext}>
            Registration active until{" "}
            <Text style={{ fontWeight: "800", color: "#FFF" }}>
              November 2026
            </Text>
            . Clean record verified[cite: 8].
          </Text>
        </View>

        {/* 2x4 Action Grid */}
        <Text style={sectionTitleStyle}>Services</Text>
        <View style={styles.gridContainer}>
          {actions.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.gridItem}
              onPress={() => router.push(item.route as any)}
            >
              <View style={styles.gridIconBox}>
                <Ionicons
                  name={item.icon as any}
                  size={26}
                  color={item.color}
                />
              </View>
              <Text style={styles.gridLabel}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Consultation / Health Report Card */}
        <Text style={sectionTitleStyle}>Recent Diagnostic Summary</Text>
        <View style={styles.activityCard}>
          <View style={styles.activityHeader}>
            <Text style={styles.activityTitle}>
              Brake System & CVT Inspection
            </Text>
            <Text style={styles.activityStatus}>COMPLETED</Text>
          </View>
          <Text style={{ color: COLORS.textSecondary, fontSize: 13 }}>
            Verified by{" "}
            <Text style={{ color: "#FFF", fontWeight: "700" }}>
              Master Mechanic Jun
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const sectionTitleStyle = {
  fontSize: 16,
  fontWeight: "800" as const,
  color: COLORS.textPrimary,
  marginBottom: 12,
};
