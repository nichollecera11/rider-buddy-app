import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";

export default function GarageScreen() {
  const healthItems = [
    { name: "Engine Oil", health: 85, status: "Good", color: COLORS.success },
    {
      name: "CVT Belt & Rollers",
      health: 45,
      status: "Replace Soon",
      color: COLORS.warning,
    },
    {
      name: "Brake Pads (Front/Rear)",
      health: 90,
      status: "Optimal",
      color: COLORS.success,
    },
    {
      name: "Tires (Tubeless)",
      health: 20,
      status: "Critical Wear",
      color: COLORS.danger,
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bgDark }}>
      <ScrollView
        contentContainerStyle={{ padding: SPACING.md, paddingTop: 50 }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "900",
            color: "#FFF",
            marginBottom: 4,
          }}
        >
          🏍️ My Garage
        </Text>
        <Text
          style={{
            color: COLORS.textSecondary,
            fontSize: 13,
            marginBottom: 20,
          }}
        >
          Digital Health History & LTO Butler[cite: 8]
        </Text>

        {/* Motorcycle Card */}
        <View style={garageStyles.bikeHeaderCard}>
          <Text
            style={{ color: COLORS.primary, fontWeight: "800", fontSize: 12 }}
          >
            PRIMARY BIKE
          </Text>
          <Text
            style={{
              color: "#FFF",
              fontSize: 20,
              fontWeight: "900",
              marginTop: 2,
            }}
          >
            Yamaha NMAX 155 (2023)
          </Text>
          <Text
            style={{ color: COLORS.textSecondary, fontSize: 13, marginTop: 2 }}
          >
            Plate: ABC 1234 • Odometer: 12,450 km
          </Text>
        </View>

        {/* Health Meters */}
        <Text
          style={{
            fontSize: 16,
            fontWeight: "800",
            color: "#FFF",
            marginBottom: 12,
          }}
        >
          Parts Health Index
        </Text>
        {healthItems.map((item, index) => (
          <View key={index} style={garageStyles.healthCard}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <Text style={{ color: "#FFF", fontWeight: "700", fontSize: 14 }}>
                {item.name}
              </Text>
              <Text
                style={{ color: item.color, fontWeight: "800", fontSize: 13 }}
              >
                {item.health}% ({item.status})
              </Text>
            </View>
            <View style={garageStyles.trackBar}>
              <View
                style={[
                  garageStyles.fillBar,
                  { width: `${item.health}%`, backgroundColor: item.color },
                ]}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const garageStyles = StyleSheet.create({
  bikeHeaderCard: {
    backgroundColor: COLORS.cardDark,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: SPACING.lg,
  },
  healthCard: {
    backgroundColor: COLORS.cardDark,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  trackBar: {
    height: 8,
    backgroundColor: "#121212",
    borderRadius: RADIUS.full,
    overflow: "hidden",
  },
  fillBar: {
    height: "100%",
    borderRadius: RADIUS.full,
  },
});
