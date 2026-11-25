import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { fetchMotorcycleMaintenanceLogs } from "../../api/maintenance";
import {
    fetchArchivedMotorcycleById,
    fetchMotorcycleById,
} from "../../api/motorcycles";
import { COLORS } from "../../constants/theme";
import { MaintenanceLog } from "../../types/maintenance";
import { Motorcycle } from "../../types/motorcycle";

export default function MotorcycleDetailsScreen() {
  const { id, archived } = useLocalSearchParams<{
    id: string;
    archived?: string;
  }>();

  const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null);
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDetails = useCallback(async () => {
    try {
      setLoading(true);

      const motorcycleId = Number(id);

      if (!Number.isInteger(motorcycleId) || motorcycleId <= 0) {
        throw new Error("Invalid motorcycle ID.");
      }

      const bikeRequest =
        archived === "true"
          ? fetchArchivedMotorcycleById(motorcycleId)
          : fetchMotorcycleById(motorcycleId);

      const [bike, history] = await Promise.all([
        bikeRequest,
        fetchMotorcycleMaintenanceLogs(motorcycleId),
      ]);

      setMotorcycle(bike);
      setLogs(history);
    } catch {
      Alert.alert(
        "Unable to Load Motorcycle",
        "We couldn't retrieve the motorcycle information. Please try again.",
        [{ text: "Go Back", onPress: () => router.back() }],
      );
    } finally {
      setLoading(false);
    }
  }, [id, archived]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString();
  }

  function formatCost(cost: number | string) {
    return Number(cost).toLocaleString("en-PH", {
      style: "currency",
      currency: "PHP",
    });
  }

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.bgLight,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={COLORS.accentPurple} />
        <Text style={{ marginTop: 12, color: COLORS.textMuted }}>
          Loading motorcycle details...
        </Text>
      </SafeAreaView>
    );
  }

  if (!motorcycle) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bgLight }}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: COLORS.accentPurple, fontWeight: "700" }}>
            ‹ Back to Garage
          </Text>
        </Pressable>

        <Text
          style={{
            fontSize: 25,
            fontWeight: "900",
            color: COLORS.textDark,
            marginTop: 20,
          }}
        >
          {motorcycle.brand?.name} {motorcycle.model}
        </Text>

        <Text style={{ color: COLORS.textMuted, marginTop: 5 }}>
          Plate Number: {motorcycle.plate_number}
        </Text>
        {archived === "true" && (
          <Text
            style={{
              color: COLORS.warning,
              fontWeight: "900",
              fontSize: 12,
              marginTop: 8,
            }}
          >
            ARCHIVED MOTORCYCLE
          </Text>
        )}

        <View
          style={{
            backgroundColor: COLORS.darkBg,
            padding: 20,
            borderRadius: 20,
            marginTop: 20,
          }}
        >
          <Text style={{ color: COLORS.primary, fontWeight: "800" }}>
            MOTORCYCLE INFORMATION
          </Text>

          {[
            ["Year Model", motorcycle.year_model],
            [
              "Engine Capacity",
              motorcycle.engine_capacity
                ? `${motorcycle.engine_capacity} cc`
                : null,
            ],
            ["Transmission", motorcycle.transmission],
            ["Fuel Type", motorcycle.fuel_type],
            ["Color", motorcycle.color],
            [
              "Current Odometer",
              motorcycle.current_odometer != null
                ? `${motorcycle.current_odometer.toLocaleString()} km`
                : null,
            ],
            ["Engine Number", motorcycle.engine_number],
            ["Chassis Number", motorcycle.chassis_number],
          ].map(([label, value]) =>
            value ? (
              <View
                key={label}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 14,
                }}
              >
                <Text style={{ color: "#BDB5C5", flex: 1 }}>{label}</Text>
                <Text
                  style={{
                    color: COLORS.textLight,
                    fontWeight: "700",
                    flex: 1,
                    textAlign: "right",
                  }}
                >
                  {value}
                </Text>
              </View>
            ) : null,
          )}
        </View>

        <View style={{ marginTop: 28 }}>
          <Text
            style={{
              fontSize: 19,
              fontWeight: "900",
              color: COLORS.textDark,
            }}
          >
            Service History
          </Text>

          <Text style={{ color: COLORS.textMuted, marginTop: 4 }}>
            Maintenance records for this motorcycle
          </Text>
        </View>

        {logs.length === 0 ? (
          <View
            style={{
              backgroundColor: COLORS.cardWhite,
              borderRadius: 16,
              padding: 22,
              marginTop: 16,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 30 }}>🔧</Text>
            <Text
              style={{
                fontWeight: "800",
                color: COLORS.textDark,
                marginTop: 10,
              }}
            >
              No Service Records Yet
            </Text>
            <Text
              style={{
                color: COLORS.textMuted,
                textAlign: "center",
                marginTop: 5,
              }}
            >
              Your maintenance history will appear here after a mechanic records
              a service.
            </Text>
          </View>
        ) : (
          logs.map((log) => (
            <View
              key={log.id}
              style={{
                backgroundColor: COLORS.cardWhite,
                borderWidth: 1,
                borderColor: COLORS.borderLight,
                borderRadius: 16,
                padding: 16,
                marginTop: 14,
              }}
            >
              <Text
                style={{
                  color: COLORS.accentPurple,
                  fontSize: 15,
                  fontWeight: "900",
                }}
              >
                {log.service_type}
              </Text>

              <Text style={{ color: COLORS.textMuted, marginTop: 6 }}>
                {formatDate(log.service_date)}
              </Text>

              <Text style={{ color: COLORS.textDark, marginTop: 10 }}>
                Odometer: {log.odometer_reading.toLocaleString()} km
              </Text>

              {log.mechanic?.user?.name ? (
                <Text style={{ color: COLORS.textMuted, marginTop: 5 }}>
                  Mechanic: {log.mechanic.user.name}
                </Text>
              ) : null}

              {log.description ? (
                <Text style={{ color: COLORS.textDark, marginTop: 10 }}>
                  {log.description}
                </Text>
              ) : null}

              <Text
                style={{
                  color: COLORS.textDark,
                  fontWeight: "800",
                  marginTop: 12,
                }}
              >
                {formatCost(log.cost)}
              </Text>

              <Text
                style={{
                  color: log.is_verified_by_mechanic
                    ? COLORS.success
                    : COLORS.warning,
                  fontSize: 11,
                  fontWeight: "800",
                  marginTop: 8,
                }}
              >
                {log.is_verified_by_mechanic
                  ? "MECHANIC VERIFIED"
                  : "NOT VERIFIED"}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
