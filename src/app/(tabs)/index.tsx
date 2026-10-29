import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../../api/client";
import { COLORS } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { styles } from "../../styles/home.styles";

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [motorcycles, setMotorcycles] = useState<any[]>([]);
  const [mechanics, setMechanics] = useState<any[]>([]);
  const [selectedMotorcycleId, setSelectedMotorcycleId] = useState<
    number | null
  >(null);

  const [loadingGarage, setLoadingGarage] = useState(true);
  const [loadingMechanics, setLoadingMechanics] = useState(true);
  const [selectedService, setSelectedService] = useState("Roadside");

  // Sidebar / Drawer state
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const selectedMotorcycle = motorcycles.find(
    (motorcycle) => motorcycle.id === selectedMotorcycleId,
  );

  const formatPeso = (amount: string | number | null | undefined) => {
    if (amount === null || amount === undefined || amount === "") {
      return "Fee not listed";
    }
    const value = Number(amount);
    if (!Number.isFinite(value)) {
      return "Fee not listed";
    }
    return `₱${value.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  useEffect(() => {
    let isMounted = true;

    const loadHomeData = async () => {
      try {
        const [garageResult, mechanicsResult] = await Promise.allSettled([
          api.get("/user-motorcycles"),
          api.get("/mechanics", {
            params: { page: 1 },
          }),
        ]);

        if (!isMounted) return;

        if (garageResult.status === "fulfilled") {
          const response = garageResult.value.data;
          const items = Array.isArray(response.data) ? response.data : [];
          setMotorcycles(items);

          const mainMotorcycle = items.find(
            (motorcycle: any) =>
              motorcycle.is_main === 1 || motorcycle.is_main === true,
          );

          if (mainMotorcycle) {
            setSelectedMotorcycleId(mainMotorcycle.id);
          } else if (items.length > 0) {
            setSelectedMotorcycleId(items[0].id);
          }
        }

        if (mechanicsResult.status === "fulfilled") {
          const response = mechanicsResult.value.data;
          const items = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response.data?.data)
              ? response.data.data
              : [];
          setMechanics(items);
        }
      } finally {
        if (isMounted) {
          setLoadingGarage(false);
          setLoadingMechanics(false);
        }
      }
    };

    loadHomeData();

    return () => {
      isMounted = false;
    };
  }, []);

  const services = [
    {
      id: "Roadside",
      label: "Roadside",
      note: "Mechanic to you",
      icon: "build-outline",
    },
    {
      id: "Maintenance",
      label: "Maintenance",
      note: "Keep it running",
      icon: "water-outline",
    },
    {
      id: "Tire care",
      label: "Tire care",
      note: "Repair or replace",
      icon: "disc-outline",
    },
    {
      id: "Tow service",
      label: "Tow service",
      note: "Move safely",
      icon: "car-outline",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Navigation Header with Hamburger Menu Button */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TouchableOpacity
            onPress={() => setSidebarVisible(true)}
            style={{ padding: 4 }}
          >
            <Ionicons name="menu" size={24} color={COLORS.textDark} />
          </TouchableOpacity>
          <View style={styles.logoGroup}>
            <View>
              <Image
                source={require("../../../assets/images/rider_buddy_temp.png")}
                style={styles.logoImage}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.logoText}>RIDER BUDDY</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.bellBtn}>
          <Ionicons
            name="notifications-outline"
            size={20}
            color={COLORS.textDark}
          />
          <View style={styles.bellDot} />
        </TouchableOpacity>
      </View>

      {/* Slide-out Sidebar / Drawer Navigation Modal */}
      <Modal
        visible={sidebarVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSidebarVisible(false)}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            backgroundColor: "rgba(0,0,0,0.6)",
          }}
        >
          {/* Sidebar Drawer Container */}
          <View
            style={{
              width: "75%",
              height: "100%",
              backgroundColor: COLORS.darkBg,
              paddingTop: 20,
              paddingHorizontal: 20,
              justifyContent: "space-between",
            }}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* User Profile Header inside Sidebar */}
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: 15,
                  borderBottomWidth: 1,
                  borderBottomColor: "rgba(255,255,255,0.1)",
                  marginBottom: 15,
                }}
                onPress={() => {
                  setSidebarVisible(false);
                  router.push("/(tabs)/profile");
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: COLORS.primary,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="person" size={24} color={COLORS.darkBg} />
                  </View>
                  <View>
                    <Text
                      style={{
                        color: "#FFF",
                        fontSize: 16,
                        fontWeight: "bold",
                      }}
                    >
                      {user?.name || "Rider"}
                    </Text>
                    <Text style={{ color: COLORS.textMuted, fontSize: 12 }}>
                      View profile
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={COLORS.textMuted}
                />
              </TouchableOpacity>

              {/* Navigation Links */}
              {[
                { label: "City", icon: "car-sport-outline", route: "/(tabs)" },
                {
                  label: "Request history",
                  icon: "time-outline",
                  route: "/(tabs)/consults",
                },
                {
                  label: "Notifications",
                  icon: "notifications-outline",
                  route: "/(tabs)",
                },
                { label: "Safety", icon: "shield-outline", route: "/(tabs)" },
                {
                  label: "Settings",
                  icon: "settings-outline",
                  route: "/(tabs)",
                },
                {
                  label: "Help",
                  icon: "help-circle-outline",
                  route: "/(tabs)",
                },
                {
                  label: "Support",
                  icon: "chatbubble-outline",
                  route: "/(tabs)",
                },
                {
                  label: "Social discount",
                  icon: "pricetag-outline",
                  route: "/(tabs)",
                },
              ].map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 16,
                    paddingVertical: 14,
                  }}
                  onPress={() => {
                    setSidebarVisible(false);
                    if (item.route) router.push(item.route as any);
                  }}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={20}
                    color={COLORS.textDark}
                  />
                  <Text
                    style={{
                      color: COLORS.textDark,
                      fontSize: 15,
                      fontWeight: "500",
                    }}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Bottom Actions inside Sidebar */}
            <View
              style={{
                paddingBottom: 30,
                paddingTop: 15,
                borderTopWidth: 1,
                borderTopColor: "rgba(255,255,255,0.1)",
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: COLORS.primary,
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: "center",
                  marginBottom: 15,
                }}
                onPress={() => setSidebarVisible(false)}
              >
                <Text
                  style={{
                    color: COLORS.darkBg,
                    fontWeight: "bold",
                    fontSize: 14,
                  }}
                >
                  Driver mode
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Backdrop Tap to Close */}
          <Pressable
            style={{ flex: 1 }}
            onPress={() => setSidebarVisible(false)}
          />
        </View>
      </Modal>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Location Selector */}
        <View style={styles.locationRow}>
          <View style={styles.locationIconBox}>
            <Ionicons name="location" size={18} color={COLORS.accentPurple} />
          </View>
          <View>
            <Text style={styles.locationEyebrow}>SERVICE LOCATION</Text>
            <TouchableOpacity style={styles.locationBtn}>
              <Text style={styles.locationText}>Makati City, Metro Manila</Text>
              <Ionicons
                name="chevron-forward"
                size={14}
                color={COLORS.accentPurple}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Greeting Banner */}
        <View style={styles.greetingRow}>
          <View>
            <Text style={styles.greetingEyebrow}>
              Good morning, {user?.name || "Rider"}
            </Text>
            <Text style={styles.greetingTitle}>Let's get you moving.</Text>
          </View>
          <View style={styles.onlinePill}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>24/7 online</Text>
          </View>
        </View>

        {/* Vehicle Health Hero Card */}
        <View style={styles.vehicleCard}>
          <View style={styles.vehicleCardTop}>
            <View>
              <View style={styles.vehicleEyebrowRow}>
                <Ionicons name="car" size={14} color={COLORS.primary} />
                <Text style={styles.vehicleEyebrowText}>YOUR VEHICLE</Text>
              </View>
              <Text style={styles.vehicleTitle}>
                {loadingGarage
                  ? "Loading your motorcycle..."
                  : selectedMotorcycle
                    ? `${selectedMotorcycle.brand?.name ?? "Motorcycle"} ${selectedMotorcycle.model}`
                    : "No motorcycle registered"}
              </Text>

              <Text style={styles.vehicleSubtitle}>
                {selectedMotorcycle
                  ? [
                      selectedMotorcycle.year_model,
                      selectedMotorcycle.engine_capacity
                        ? `${selectedMotorcycle.engine_capacity}cc`
                        : null,
                      selectedMotorcycle.plate_number,
                    ]
                      .filter(Boolean)
                      .join(" · ")
                  : loadingGarage
                    ? "Fetching your garage"
                    : "Add a motorcycle to get started"}
              </Text>
            </View>
            <TouchableOpacity style={styles.switchBtn}>
              <Text style={styles.switchBtnText}>Switch</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.vehicleCardDivider} />

          <View style={styles.vehicleCardBottom}>
            <View style={styles.garagePrompt}>
              <Ionicons
                name="bicycle-outline"
                size={22}
                color={COLORS.primary}
                style={{ marginRight: 10 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.garagePromptTitle}>
                  {motorcycles.length} registered motorcycle
                  {motorcycles.length === 1 ? "" : "s"}
                </Text>
                <Text style={styles.garagePromptSubtitle}>
                  Manage your vehicles in your garage
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.switchBtn}
              onPress={() => router.push("/(tabs)/garage")}
            >
              <Text style={styles.switchBtnText}>My garage</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Emergency Dispatch Banner */}
        <TouchableOpacity
          style={styles.dispatchCard}
          activeOpacity={0.85}
          onPress={() => router.push("/(tabs)/consults")}
        >
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <View style={styles.dispatchIconBox}>
              <Ionicons name="flash" size={22} color={COLORS.darkBg} />
            </View>
            <View>
              <Text style={styles.dispatchEyebrow}>NEED HELP NOW?</Text>
              <Text style={styles.dispatchTitle}>Dispatch a mechanic</Text>
              <Text style={styles.dispatchSubtitle}>ETA from 12 minutes</Text>
            </View>
          </View>
          <View style={styles.dispatchBtn}>
            <Text style={styles.dispatchBtnText}>Get help</Text>
            <Ionicons name="chevron-forward" size={14} color="#FFF" />
          </View>
        </TouchableOpacity>

        {/* Services Section */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>EXPERT CARE</Text>
            <Text style={styles.sectionTitleText}>What do you need?</Text>
          </View>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>View all</Text>
            <Ionicons
              name="chevron-forward"
              size={14}
              color={COLORS.accentPurple}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.servicesGrid}>
          {services.map((item) => {
            const isSelected = selectedService === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.serviceCard,
                  isSelected && styles.serviceCardActive,
                ]}
                onPress={() => setSelectedService(item.id)}
              >
                <View
                  style={[
                    styles.serviceIconBox,
                    isSelected && styles.serviceIconBoxActive,
                  ]}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={22}
                    color={COLORS.darkBg}
                  />
                </View>
                <Text style={styles.serviceTitle}>{item.label}</Text>
                <Text style={styles.serviceNote}>{item.note}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Live Mechanic Preview */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>RIDER BUDDY MECHANICS</Text>
            <Text style={styles.sectionTitleText}>Meet a mechanic</Text>
          </View>
        </View>

        {loadingMechanics ? (
          <View style={styles.mechanicEmpty}>
            <Text style={styles.mechanicEmptyText}>Finding mechanics...</Text>
          </View>
        ) : mechanics.length === 0 ? (
          <View style={styles.mechanicEmpty}>
            <Ionicons
              name="construct-outline"
              size={28}
              color={COLORS.textMuted}
            />
            <Text style={styles.mechanicEmptyTitle}>
              No mechanics to display yet
            </Text>
            <Text style={styles.mechanicEmptyText}>
              Please try again later.
            </Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.mechanicCarouselContent}
          >
            {mechanics.map((mechanic) => {
              const isAvailable =
                mechanic.is_available === true || mechanic.is_available === 1;

              const isVerified =
                mechanic.is_verified === true || mechanic.is_verified === 1;

              return (
                <View key={mechanic.id} style={styles.mechanicCard}>
                  <View style={styles.mechanicAvatarPlaceholder}>
                    <Ionicons
                      name="construct"
                      size={30}
                      color={COLORS.accentPurple}
                    />
                    {isAvailable && <View style={styles.onlineIndicator} />}
                  </View>

                  <View style={styles.mechanicInfo}>
                    <View style={styles.mechanicNameRow}>
                      <Text style={styles.mechanicName} numberOfLines={1}>
                        {mechanic.shop_name || mechanic.name}
                      </Text>

                      {isVerified && (
                        <Ionicons
                          name="shield-checkmark"
                          size={15}
                          color={COLORS.success}
                        />
                      )}
                    </View>

                    <Text style={styles.mechanicTitle} numberOfLines={1}>
                      {mechanic.specialization || "General mechanic"}
                    </Text>

                    {mechanic.years_experience != null && (
                      <Text style={styles.mechanicExperience}>
                        {mechanic.years_experience} years experience
                      </Text>
                    )}

                    <View
                      style={[
                        styles.mechanicStatusPill,
                        isAvailable
                          ? styles.mechanicStatusAvailable
                          : styles.mechanicStatusUnavailable,
                      ]}
                    >
                      <Text
                        style={[
                          styles.mechanicStatusText,
                          isAvailable
                            ? styles.mechanicStatusTextAvailable
                            : styles.mechanicStatusTextUnavailable,
                        ]}
                      >
                        {isAvailable ? "Available" : "Unavailable"}
                      </Text>
                    </View>

                    <Text style={styles.mechanicFeeLabel}>Diagnostic fee</Text>
                    <Text style={styles.mechanicFee}>
                      {formatPeso(mechanic.diagnostic_fee_base)}
                    </Text>
                  </View>

                  {isVerified && (
                    <View style={styles.mechanicVerifiedMark}>
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color={COLORS.success}
                      />
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>
        )}

        {/* Care Plan Banner */}
        <TouchableOpacity style={styles.membershipCard}>
          <Ionicons name="shield-half" size={38} color={COLORS.primary} />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 8,
                fontWeight: "900",
                color: COLORS.primary,
                letterSpacing: 1,
              }}
            >
              RIDER BUDDY + CARE PLAN
            </Text>
            <Text style={styles.membershipTitle}>
              Save 20% on every service
            </Text>
            <Text style={styles.membershipSub}>Explore membership</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
