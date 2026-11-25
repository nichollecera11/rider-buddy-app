import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  fetchArchivedMotorcycles,
  fetchMotorcycles,
} from "../../api/motorcycles";
import { COLORS } from "../../constants/theme";
import { garageStyles } from "../../styles/garage.styles";
import { Motorcycle } from "../../types/motorcycle";

export default function GarageScreen() {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [archivedMotorcycles, setArchivedMotorcycles] = useState<Motorcycle[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadMotorcycles() {
        try {
          setLoading(true);

          const data = await fetchMotorcycles();

          // Archived motorcycles are optional.
          // If their request fails, the active Garage still loads.
          const archivedData = await fetchArchivedMotorcycles().catch(() => []);

          if (isActive) {
            setMotorcycles(data);
            setArchivedMotorcycles(archivedData);
          }
        } catch {
          if (isActive) {
            Alert.alert(
              "Unable to Load Garage",
              "Please check your connection and try again.",
            );
          }
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      }

      loadMotorcycles();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const primaryMotorcycle =
    motorcycles.find((motorcycle) => motorcycle.is_main) || motorcycles[0];

  const otherMotorcycles = motorcycles.filter(
    (motorcycle) => motorcycle.id !== primaryMotorcycle?.id,
  );

  function getMotorcycleDetails(motorcycle: Motorcycle) {
    const details = [
      motorcycle.year_model,
      motorcycle.engine_capacity ? `${motorcycle.engine_capacity} cc` : null,
    ].filter(Boolean);

    return details.join(" • ");
  }

  function handleRegister() {
    router.push("/motorcycle/register");
  }

  return (
    <SafeAreaView style={garageStyles.container}>
      <ScrollView
        contentContainerStyle={garageStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={garageStyles.header}>
          <Text style={garageStyles.headerTitle}>My Garage</Text>

          <Text style={garageStyles.headerSubtitle}>
            Your motorcycles and vehicle information
          </Text>
        </View>

        {/* LOADING */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color={COLORS.accentPurple}
            style={{ marginTop: 40 }}
          />
        ) : (
          <>
            {/* PRIMARY MOTORCYCLE */}
            {primaryMotorcycle ? (
              <Pressable
                style={garageStyles.bikeHeaderCard}
                onPress={() =>
                  router.push({
                    pathname: "/motorcycle/[id]",
                    params: {
                      id: String(primaryMotorcycle.id),
                    },
                  })
                }
              >
                <Text style={garageStyles.primaryBikeLabel}>
                  PRIMARY MOTORCYCLE
                </Text>

                <Text style={garageStyles.bikeName}>
                  {primaryMotorcycle.brand?.name} {primaryMotorcycle.model}
                </Text>

                <Text style={garageStyles.bikeDetails}>
                  Plate: {primaryMotorcycle.plate_number}
                </Text>

                <View style={garageStyles.bikeMeta}>
                  {getMotorcycleDetails(primaryMotorcycle) ? (
                    <Text style={garageStyles.bikeMetaText}>
                      {getMotorcycleDetails(primaryMotorcycle)}
                    </Text>
                  ) : null}

                  {primaryMotorcycle.current_odometer != null ? (
                    <Text style={garageStyles.bikeMetaText}>
                      {primaryMotorcycle.current_odometer.toLocaleString()} km
                    </Text>
                  ) : null}
                </View>
              </Pressable>
            ) : (
              <View style={garageStyles.emptyCard}>
                <Text style={{ fontSize: 36 }}>🏍️</Text>

                <Text style={garageStyles.emptyTitle}>
                  Your garage is empty
                </Text>

                <Text style={garageStyles.emptyText}>
                  Register your motorcycle to manage your vehicle information
                  and request roadside assistance.
                </Text>
              </View>
            )}

            {/* OTHER MOTORCYCLES */}
            {otherMotorcycles.length > 0 && (
              <>
                <View style={garageStyles.sectionHeader}>
                  <Text style={garageStyles.sectionTitle}>
                    Other Motorcycles
                  </Text>

                  <Text style={garageStyles.bikeCount}>
                    {otherMotorcycles.length}{" "}
                    {otherMotorcycles.length === 1 ? "BIKE" : "BIKES"}
                  </Text>
                </View>

                {otherMotorcycles.map((motorcycle) => (
                  <Pressable
                    key={motorcycle.id}
                    style={garageStyles.bikeCard}
                    onPress={() =>
                      router.push({
                        pathname: "/motorcycle/[id]",
                        params: {
                          id: String(motorcycle.id),
                        },
                      })
                    }
                  >
                    <Text style={garageStyles.bikeCardName}>
                      {motorcycle.brand?.name} {motorcycle.model}
                    </Text>

                    <Text style={garageStyles.bikeCardDetails}>
                      Plate: {motorcycle.plate_number}
                    </Text>

                    {getMotorcycleDetails(motorcycle) ? (
                      <Text style={garageStyles.bikeCardDetails}>
                        {getMotorcycleDetails(motorcycle)}
                      </Text>
                    ) : null}

                    {motorcycle.is_main && (
                      <View style={garageStyles.mainBadge}>
                        <Text style={garageStyles.mainBadgeText}>PRIMARY</Text>
                      </View>
                    )}
                  </Pressable>
                ))}
              </>
            )}

            {/* MOTORCYCLE COUNT */}
            {motorcycles.length > 0 && (
              <View style={garageStyles.sectionHeader}>
                <Text style={garageStyles.sectionTitle}>My Motorcycles</Text>

                <Text style={garageStyles.bikeCount}>
                  {motorcycles.length}{" "}
                  {motorcycles.length === 1 ? "BIKE" : "BIKES"}
                </Text>
              </View>
            )}

            {/* REGISTER BUTTON */}
            <Pressable
              style={garageStyles.registerButton}
              onPress={handleRegister}
            >
              <Text style={garageStyles.registerButtonText}>
                + Register Motorcycle
              </Text>

              {/* ARCHIVED MOTORCYCLES */}
              {archivedMotorcycles.length > 0 && (
                <>
                  <View style={garageStyles.sectionHeader}>
                    <Text style={garageStyles.sectionTitle}>
                      Archived Motorcycles
                    </Text>

                    <Text style={garageStyles.bikeCount}>
                      {archivedMotorcycles.length}{" "}
                      {archivedMotorcycles.length === 1 ? "BIKE" : "BIKES"}
                    </Text>
                  </View>

                  {archivedMotorcycles.map((motorcycle) => (
                    <Pressable
                      key={motorcycle.id}
                      style={garageStyles.bikeCard}
                      onPress={() =>
                        router.push({
                          pathname: "/motorcycle/[id]",
                          params: {
                            id: String(motorcycle.id),
                            archived: "true",
                          },
                        })
                      }
                    >
                      <Text style={garageStyles.bikeCardName}>
                        {motorcycle.brand?.name} {motorcycle.model}
                      </Text>

                      <Text style={garageStyles.bikeCardDetails}>
                        Plate: {motorcycle.plate_number}
                      </Text>

                      {getMotorcycleDetails(motorcycle) ? (
                        <Text style={garageStyles.bikeCardDetails}>
                          {getMotorcycleDetails(motorcycle)}
                        </Text>
                      ) : null}

                      <View style={garageStyles.mainBadge}>
                        <Text style={garageStyles.mainBadgeText}>ARCHIVED</Text>
                      </View>
                    </Pressable>
                  ))}
                </>
              )}
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
