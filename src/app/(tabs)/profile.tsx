import { Ionicons } from "@expo/vector-icons";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { styles } from "../../styles/profile.styles";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out of Rider Buddy?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            await logout();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Title */}
        <Text style={styles.headerTitle}>Rider Profile</Text>

        {/* User Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarBox}>
            <Ionicons name="person" size={36} color={COLORS.primary} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || "Rider"}</Text>
            <Text style={styles.userEmail}>
              {user?.email || "rider@example.com"}
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>VERIFIED RIDER</Text>
            </View>
          </View>
        </View>

        {/* Account Quick Links */}
        <Text style={styles.sectionTitle}>Account Settings</Text>

        <View style={styles.menuGroup}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons
                name="bicycle-outline"
                size={20}
                color={COLORS.accentPurple}
              />
              <Text style={styles.menuText}>Registered Vehicles</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={COLORS.textMuted}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color={COLORS.success}
              />
              <Text style={styles.menuText}>LTO Documents & OR/CR</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={COLORS.textMuted}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={COLORS.warning}
              />
              <Text style={styles.menuText}>Security & Password</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={COLORS.textMuted}
            />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons
            name="log-out-outline"
            size={22}
            color={COLORS.danger}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.logoutBtnText}>SIGN OUT</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Rider Buddy v1.0.0 • Expo SDK 57</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
