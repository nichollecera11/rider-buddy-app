import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants/theme";
import { garageStyles } from "../../styles/garage.styles";

export default function GarageScreen() {
  const healthItems = [
    {
      name: "Engine Oil",
      health: 85,
      status: "Good",
      color: COLORS.success,
    },
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
    <SafeAreaView style={garageStyles.container}>
      <ScrollView contentContainerStyle={garageStyles.scrollContent}>
        <Text style={garageStyles.headerTitle}>🏍️ My Garage</Text>

        <Text style={garageStyles.headerSubtitle}>
          Your motorcycles and maintenance history
        </Text>

        <View style={garageStyles.bikeHeaderCard}>
          <Text style={garageStyles.primaryBikeLabel}>PRIMARY BIKE</Text>

          <Text style={garageStyles.bikeName}>Yamaha NMAX 155 (2023)</Text>

          <Text style={garageStyles.bikeDetails}>
            Plate: ABC 1234 • Odometer: 12,450 km
          </Text>
        </View>

        <Text style={garageStyles.sectionTitle}>Parts Health Index</Text>

        {healthItems.map((item) => (
          <View key={item.name} style={garageStyles.healthCard}>
            <View style={garageStyles.healthRow}>
              <Text style={garageStyles.healthName}>{item.name}</Text>

              <Text style={[garageStyles.healthStatus, { color: item.color }]}>
                {item.health}% ({item.status})
              </Text>
            </View>

            <View style={garageStyles.trackBar}>
              <View
                style={[
                  garageStyles.fillBar,
                  {
                    width: `${item.health}%`,
                    backgroundColor: item.color,
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
