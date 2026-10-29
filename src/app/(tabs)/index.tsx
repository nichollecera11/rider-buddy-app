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

type Motorcycle = {
  id: number;
  brand?: { name?: string } | null;
  model?: string | null;
  year_model?: string | number | null;
  engine_capacity?: string | number | null;
  plate_number?: string | null;
  is_main?: boolean | number;
};

type Mechanic = {
  id: number;
  name?: string;
  shop_name?: string | null;
  specialization?: string | null;
  years_experience?: number | null;
  diagnostic_fee_base?: string | number | null;
  is_available?: boolean | number;
  is_verified?: boolean | number;
};

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [selectedMotorcycleId, setSelectedMotorcycleId] = useState<
    number | null
  >(null);

  const [loadingGarage, setLoadingGarage] = useState(true);
  const [loadingMechanics, setLoadingMechanics] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const selectedMotorcycle = motorcycles.find(
    (motorcycle) => motorcycle.id === selectedMotorcycleId,
  );

  useEffect(() => {
    let isMounted = true;

    async function loadHomeData() {
      try {
        const [garageResult, mechanicsResult] = await Promise.allSettled([
          api.get("/user-motorcycles"),
          api.get("/mechanics", { params: { page: 1 } }),
        ]);

        if (!isMounted) return;

        if (garageResult.status === "fulfilled") {
          const response = garageResult.value.data;
          const items: Motorcycle[] = Array.isArray(response.data)
            ? response.data
            : [];

          setMotorcycles(items);

          const mainMotorcycle = items.find(
            (motorcycle) =>
              motorcycle.is_main === true || motorcycle.is_main === 1,
          );

          setSelectedMotorcycleId(mainMotorcycle?.id ?? items[0]?.id ?? null);
        }

        if (mechanicsResult.status === "fulfilled") {
          const response = mechanicsResult.value.data;
          const items: Mechanic[] = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response.data?.data)
              ? response.data.data
              : [];

          setMechanics(items);
        }
      } catch (error) {
        console.error("Unable to load home data:", error);
      } finally {
        if (isMounted) {
          setLoadingGarage(false);
          setLoadingMechanics(false);
        }
      }
    }

    loadHomeData();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatPeso = (amount: string | number | null | undefined): string => {
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

  const closeDrawerAndNavigate = (route: string) => {
    setSidebarVisible(false);
    router.push(route as any);
  };

  const switchMotorcycle = () => {
    if (motorcycles.length < 2) {
      router.push("/(tabs)/garage");
      return;
    }

    const currentIndex = motorcycles.findIndex(
      (motorcycle) => motorcycle.id === selectedMotorcycleId,
    );

    const nextIndex = (currentIndex + 1) % motorcycles.length;

    setSelectedMotorcycleId(motorcycles[nextIndex].id);
  };

  const services = [
    {
      id: "roadside",
      label: "Roadside help",
      note: "Get help on the road",
      icon: "build-outline",
    },
    {
      id: "maintenance",
      label: "Maintenance",
      note: "Keep your bike running",
      icon: "water-outline",
    },
    {
      id: "tire",
      label: "Tire care",
      note: "Tire repair assistance",
      icon: "disc-outline",
    },
    {
      id: "tow",
      label: "Tow service",
      note: "Help moving your bike",
      icon: "car-outline",
    },
  ];

  const drawerGroups = [
    {
      title: "YOUR RIDER BUDDY",
      items: [
        {
          label: "Home",
          icon: "home-outline",
          route: "/(tabs)",
        },
        {
          label: "My Garage",
          icon: "bicycle-outline",
          route: "/(tabs)/garage",
        },
        {
          label: "Request roadside help",
          icon: "flash-outline",
          route: "/(tabs)/consults",
        },
        {
          label: "Motorcycle marketplace",
          icon: "storefront-outline",
          route: "/(tabs)/shop",
        },
      ],
    },
    {
      title: "YOUR ACCOUNT",
      items: [
        {
          label: "My Profile",
          icon: "person-outline",
          route: "/(tabs)/profile",
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          <TouchableOpacity
            accessibilityLabel="Open navigation menu"
            onPress={() => setSidebarVisible(true)}
            style={{ padding: 6 }}
          >
            <Ionicons name="menu-outline" size={27} color={COLORS.textDark} />
          </TouchableOpacity>

          <View style={styles.logoGroup}>
            <Image
              source={require("../../../assets/images/rider_buddy_temp.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>RIDER BUDDY</Text>
          </View>
        </View>

        <TouchableOpacity
          accessibilityLabel="Notifications"
          onPress={() => {
            // Notifications screen can be connected when implemented.
          }}
          style={styles.bellBtn}
        >
          <Ionicons
            name="notifications-outline"
            size={21}
            color={COLORS.textDark}
          />
          <View style={styles.bellDot} />
        </TouchableOpacity>
      </View>

      {/* Light Sidebar */}
      <Modal
        visible={sidebarVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSidebarVisible(false)}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            backgroundColor: "rgba(24,22,27,0.45)",
          }}
        >
          <View
            style={{
              width: "82%",
              maxWidth: 360,
              height: "100%",
              backgroundColor: COLORS.cardWhite,
              paddingTop: 18,
              paddingHorizontal: 20,
              paddingBottom: 20,
            }}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              {/* Profile summary */}
              <TouchableOpacity
                onPress={() => closeDrawerAndNavigate("/(tabs)/profile")}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 18,
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.borderLight,
                  marginBottom: 22,
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: "#FFF3B0",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <Ionicons
                    name="person-outline"
                    size={25}
                    color={COLORS.accentPurple}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: COLORS.textDark,
                      fontSize: 16,
                      fontWeight: "800",
                    }}
                  >
                    {user?.name || "Rider"}
                  </Text>

                  <Text
                    style={{
                      color: COLORS.textMuted,
                      fontSize: 12,
                      marginTop: 4,
                    }}
                  >
                    View and manage your profile
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={COLORS.textMuted}
                />
              </TouchableOpacity>

              {/* Navigation groups */}
              {drawerGroups.map((group) => (
                <View key={group.title} style={{ marginBottom: 24 }}>
                  <Text
                    style={{
                      color: COLORS.textMuted,
                      fontSize: 10,
                      fontWeight: "800",
                      letterSpacing: 1.2,
                      marginBottom: 10,
                    }}
                  >
                    {group.title}
                  </Text>

                  {group.items.map((item) => (
                    <TouchableOpacity
                      key={item.label}
                      onPress={() => closeDrawerAndNavigate(item.route)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: 14,
                        paddingHorizontal: 12,
                        marginBottom: 4,
                        borderRadius: 12,
                      }}
                    >
                      <Ionicons
                        name={item.icon as any}
                        size={21}
                        color={COLORS.accentPurple}
                      />

                      <Text
                        style={{
                          color: COLORS.textDark,
                          fontSize: 14,
                          fontWeight: "600",
                          marginLeft: 14,
                          flex: 1,
                        }}
                      >
                        {item.label}
                      </Text>

                      <Ionicons
                        name="chevron-forward"
                        size={15}
                        color={COLORS.textMuted}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              ))}

              {/* Small brand card */}
              <View
                style={{
                  backgroundColor: "#FFF8D9",
                  borderRadius: 16,
                  padding: 16,
                  marginTop: "auto",
                  marginBottom: 18,
                }}
              >
                <Ionicons
                  name="shield-checkmark-outline"
                  size={25}
                  color={COLORS.accentPurple}
                />

                <Text
                  style={{
                    color: COLORS.textDark,
                    fontSize: 14,
                    fontWeight: "800",
                    marginTop: 10,
                  }}
                >
                  Ride with confidence
                </Text>

                <Text
                  style={{
                    color: COLORS.textMuted,
                    fontSize: 12,
                    lineHeight: 18,
                    marginTop: 4,
                  }}
                >
                  Keep your motorcycle details updated and know where to find
                  roadside assistance.
                </Text>
              </View>
            </ScrollView>

            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: COLORS.borderLight,
                paddingTop: 14,
              }}
            >
              <TouchableOpacity
                onPress={() => setSidebarVisible(false)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 12,
                }}
              >
                <Ionicons
                  name="close-outline"
                  size={20}
                  color={COLORS.textMuted}
                />
                <Text
                  style={{
                    color: COLORS.textMuted,
                    fontSize: 13,
                    fontWeight: "700",
                    marginLeft: 8,
                  }}
                >
                  Close menu
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Pressable
            style={{ flex: 1 }}
            accessibilityLabel="Close navigation menu"
            onPress={() => setSidebarVisible(false)}
          />
        </View>
      </Modal>

      {/* Home content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Location placeholder - no invented city */}
        <View style={styles.locationRow}>
          <View style={styles.locationIconBox}>
            <Ionicons
              name="location-outline"
              size={18}
              color={COLORS.accentPurple}
            />
          </View>

          <View>
            <Text style={styles.locationEyebrow}>SERVICE LOCATION</Text>

            <Text style={styles.locationText}>
              Set location when requesting help
            </Text>
          </View>
        </View>

        {/* Greeting */}
        <View style={styles.greetingRow}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={styles.greetingEyebrow}>
              WELCOME, {user?.name || "RIDER"}
            </Text>
            <Text style={styles.greetingTitle}>Let’s get you moving.</Text>
          </View>

          <View style={styles.onlinePill}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Rider Buddy</Text>
          </View>
        </View>

        {/* Motorcycle card */}
        <View style={styles.vehicleCard}>
          <View style={styles.vehicleCardTop}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <View style={styles.vehicleEyebrowRow}>
                <Ionicons
                  name="bicycle-outline"
                  size={15}
                  color={COLORS.primary}
                />
                <Text style={styles.vehicleEyebrowText}>YOUR MOTORCYCLE</Text>
              </View>

              <Text style={styles.vehicleTitle}>
                {loadingGarage
                  ? "Loading your motorcycle..."
                  : selectedMotorcycle
                    ? `${selectedMotorcycle.brand?.name ?? "Motorcycle"} ${
                        selectedMotorcycle.model ?? ""
                      }`.trim()
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
                      .join(" · ") || "Motorcycle details"
                  : loadingGarage
                    ? "Fetching your garage"
                    : "Add your motorcycle to get started"}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.switchBtn}
              onPress={switchMotorcycle}
              disabled={loadingGarage}
            >
              <Text style={styles.switchBtnText}>
                {motorcycles.length > 1 ? "Switch" : "View"}
              </Text>
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

        {/* Emergency assistance */}
        <TouchableOpacity
          style={styles.dispatchCard}
          activeOpacity={0.85}
          onPress={() => router.push("/(tabs)/consults")}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
              paddingRight: 8,
            }}
          >
            <View style={styles.dispatchIconBox}>
              <Ionicons name="flash" size={22} color={COLORS.darkBg} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.dispatchEyebrow}>NEED HELP NOW?</Text>
              <Text style={styles.dispatchTitle}>Find roadside assistance</Text>
              <Text style={styles.dispatchSubtitle}>
                Request help from a mechanic
              </Text>
            </View>
          </View>

          <View style={styles.dispatchBtn}>
            <Text style={styles.dispatchBtnText}>Get help</Text>
            <Ionicons name="chevron-forward" size={14} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        {/* Services */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>EXPERT CARE</Text>
            <Text style={styles.sectionTitleText}>What do you need?</Text>
          </View>
        </View>

        <View style={styles.servicesGrid}>
          {services.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.serviceCard}
              activeOpacity={0.8}
              onPress={() => router.push("/(tabs)/consults")}
            >
              <View style={styles.serviceIconBox}>
                <Ionicons
                  name={item.icon as any}
                  size={22}
                  color={COLORS.darkBg}
                />
              </View>

              <Text style={styles.serviceTitle}>{item.label}</Text>
              <Text style={styles.serviceNote}>{item.note}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Mechanic preview */}
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
                <TouchableOpacity
                  key={mechanic.id}
                  activeOpacity={0.85}
                  style={styles.mechanicCard}
                  onPress={() => router.push("/(tabs)/consults")}
                >
                  <View style={styles.mechanicAvatarPlaceholder}>
                    <Ionicons
                      name="construct-outline"
                      size={30}
                      color={COLORS.accentPurple}
                    />
                    {isAvailable && <View style={styles.onlineIndicator} />}
                  </View>

                  <View style={styles.mechanicInfo}>
                    <View style={styles.mechanicNameRow}>
                      <Text style={styles.mechanicName} numberOfLines={1}>
                        {mechanic.shop_name || mechanic.name || "Mechanic"}
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
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* Care plan - informational for now */}
        <View style={styles.membershipCard}>
          <Ionicons
            name="shield-checkmark-outline"
            size={38}
            color={COLORS.primary}
          />

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 9,
                fontWeight: "900",
                color: COLORS.primary,
                letterSpacing: 1,
              }}
            >
              RIDER BUDDY
            </Text>

            <Text style={styles.membershipTitle}>
              Help when the road gets rough
            </Text>

            <Text style={styles.membershipSub}>
              Your motorcycle support companion
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
