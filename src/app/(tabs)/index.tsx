import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { styles } from "../../styles/home.styles";

export default function HomeScreen() {
  const { user } = useAuth();
  const [selectedService, setSelectedService] = useState("Roadside");

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
      icon: "oil-drop",
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
      {/* Top Navigation Header */}
      <View style={styles.header}>
        <View style={styles.logoGroup}>
          <View style={styles.logoIconBadge}>
            <Ionicons name="build" size={18} color={COLORS.darkBg} />
          </View>
          <Text style={styles.logoText}>RIDER BUDDY</Text>
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
              <Text style={styles.vehicleTitle}>Yamaha NMAX 155</Text>
              <Text style={styles.vehicleSubtitle}>
                2023 · 155cc VVA · NCG 4832
              </Text>
            </View>
            <TouchableOpacity style={styles.switchBtn}>
              <Text style={styles.switchBtnText}>Switch</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.vehicleCardDivider} />

          <View style={styles.vehicleCardBottom}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={styles.healthBadge}>
                <Text style={styles.healthScoreText}>92</Text>
              </View>
              <View>
                <Text style={styles.healthLabelTitle}>Vehicle health</Text>
                <Text style={styles.healthLabelSub}>Everything looks good</Text>
              </View>
            </View>

            <View style={styles.checkedBadge}>
              <Ionicons
                name="shield-checkmark"
                size={14}
                color={COLORS.primary}
              />
              <Text style={styles.checkedText}>Checked</Text>
            </View>
          </View>
        </View>

        {/* Quick Emergency Dispatch Banner */}
        <TouchableOpacity style={styles.dispatchCard}>
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

        {/* Top Mechanic Nearby Section */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>rIDER BUDDY VERIFIED</Text>
            <Text style={styles.sectionTitleText}>Top mechanic nearby</Text>
          </View>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>See map</Text>
            <Ionicons
              name="chevron-forward"
              size={14}
              color={COLORS.accentPurple}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.mechanicCard}>
          <View style={{ position: "relative" }}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?crop=faces&cs=tinysrgb&fit=crop&fm=jpg&h=220&ixlib=rb-4.1.0&q=85&w=220",
              }}
              style={styles.mechanicAvatar}
            />
            <View style={styles.onlineIndicator} />
          </View>

          <View style={styles.mechanicInfo}>
            <View style={styles.mechanicNameRow}>
              <Text style={styles.mechanicName}>Carlo Mendoza</Text>
              <Ionicons
                name="shield-checkmark"
                size={14}
                color={COLORS.accentPurple}
              />
            </View>
            <Text style={styles.mechanicTitle}>
              ASE-certified master mechanic
            </Text>

            <View style={styles.mechanicMetaRow}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 2 }}
              >
                <Ionicons name="star" size={12} color={COLORS.warning} />
                <Text style={styles.ratingText}>
                  4.9 <Text style={styles.ratingCountText}>(238)</Text>
                </Text>
              </View>
              <Text style={styles.distanceText}>• 📍 1.2 km</Text>
            </View>
          </View>

          <View style={styles.mechanicChevronBtn}>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={COLORS.accentPurple}
            />
          </View>
        </TouchableOpacity>

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
