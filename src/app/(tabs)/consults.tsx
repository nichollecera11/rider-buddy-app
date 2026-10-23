import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import client from "../../api/client";
import { COLORS } from "../../constants/theme";
import { styles } from "../../styles/consults.styles";

type Motorcycle = {
  id: number;
  model: string;
  brand?: {
    id: number;
    name: string;
  } | null;
  plate_number: string | null;
  fuel_type: string | null;
  is_main: number | boolean;
  is_active: number | boolean;
};

type GarageResponse = {
  message: string;
  count: number;
  data: Motorcycle[];
};

type Mechanic = {
  id: number;
  name: string;
  shop_name: string | null;
  address: string | null;
  specialization: string | null;
  years_experience: number;
  is_verified: boolean;
  is_available: boolean;
  diagnostic_fee_base: string | number;
  is_24_7: boolean;
  offers_towing: boolean;
  rating: number;
  latitude: number | null;
  longitude: number | null;
};

type MechanicsResponse = {
  message: string;
  data: {
    data: Mechanic[];
    current_page: number;
    last_page: number;
    total: number;
  };
};

export default function ConsultsScreen() {
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [selectedMechanicId, setSelectedMechanicId] = useState<number | null>(
    null,
  );
  const [isLoadingMechanics, setIsLoadingMechanics] = useState(true);
  const [mechanicError, setMechanicError] = useState<string | null>(null);

  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [selectedMotorcycleId, setSelectedMotorcycleId] = useState<
    number | null
  >(null);

  const [issueDescription, setIssueDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadMotorcycles = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await client.get<GarageResponse>("/user-motorcycles");

      const activeMotorcycles = response.data.data.filter(
        (motorcycle) =>
          motorcycle.is_active === true || motorcycle.is_active === 1,
      );

      setMotorcycles(activeMotorcycles);

      // Keep the current selection if it still exists.
      setSelectedMotorcycleId((currentId) => {
        if (
          currentId !== null &&
          activeMotorcycles.some((motorcycle) => motorcycle.id === currentId)
        ) {
          return currentId;
        }

        // Otherwise, prefer the main motorcycle.
        const mainMotorcycle = activeMotorcycles.find(
          (motorcycle) =>
            motorcycle.is_main === true || motorcycle.is_main === 1,
        );

        // If there is no main motorcycle, let the rider choose.
        return mainMotorcycle?.id ?? null;
      });
    } catch (error) {
      console.error("Failed to load rider motorcycles:", error);
      setErrorMessage(
        "We couldn't load your garage. Please check your connection and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMechanics = useCallback(async () => {
    setIsLoadingMechanics(true);
    setMechanicError(null);

    try {
      const response = await client.get<MechanicsResponse>("/mechanics");

      const availableMechanics = response.data.data.data.filter(
        (mechanic) => mechanic.is_available,
      );

      setMechanics(availableMechanics);

      setSelectedMechanicId((currentId) =>
        currentId !== null &&
        availableMechanics.some((mechanic) => mechanic.id === currentId)
          ? currentId
          : null,
      );
    } catch (error) {
      console.error("Failed to load mechanics:", error);
      setMechanicError("Couldn't load mechanics. Please try again.");
    } finally {
      setIsLoadingMechanics(false);
    }
  }, []);

  useEffect(() => {
    void loadMechanics();
  }, [loadMechanics]);

  useEffect(() => {
    void loadMotorcycles();
  }, [loadMotorcycles]);

  const handleFindAssistance = () => {
    if (selectedMotorcycleId === null) {
      Alert.alert(
        "Select your motorcycle",
        "Please select the motorcycle that needs assistance.",
      );
      return;
    }

    if (issueDescription.trim().length < 10) {
      Alert.alert(
        "Description required",
        "Please describe the problem using at least 10 characters.",
      );
      return;
    }

    if (selectedMechanicId === null) {
      Alert.alert("Choose a mechanic", "Please select an available mechanic.");
      return;
    }

    Alert.alert(
      "Ready for the next step",
      "Your motorcycle and issue description are ready. We still need to connect mechanic discovery and SOS submission.",
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.eyebrow}>RIDER BUDDY SOS</Text>

        <Text style={styles.title}>Need help on the road?</Text>

        <Text style={styles.subtitle}>
          Tell us what's wrong with your motorcycle so you can find a mechanic.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Your motorcycle</Text>

          <Text style={styles.sectionDescription}>
            Select the motorcycle that needs assistance.
          </Text>

          {isLoading ? (
            <View style={styles.garageState}>
              <ActivityIndicator color={COLORS.primary} size="large" />
              <Text style={styles.garageStateText}>Loading your garage...</Text>
            </View>
          ) : errorMessage ? (
            <View style={styles.garageState}>
              <Text style={styles.garageError}>{errorMessage}</Text>

              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => void loadMotorcycles()}
                style={styles.retryButton}
              >
                <Text style={styles.retryButtonText}>TRY AGAIN</Text>
              </TouchableOpacity>
            </View>
          ) : motorcycles.length === 0 ? (
            <View style={styles.garageState}>
              <Text style={styles.garageStateText}>
                No active motorcycles found in your garage.
              </Text>
              <Text style={styles.garageHint}>
                Register a motorcycle before requesting roadside assistance.
              </Text>
            </View>
          ) : (
            motorcycles.map((motorcycle) => {
              const isSelected = selectedMotorcycleId === motorcycle.id;

              return (
                <TouchableOpacity
                  key={motorcycle.id}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  activeOpacity={0.8}
                  onPress={() => setSelectedMotorcycleId(motorcycle.id)}
                  style={[
                    styles.motorcycleCard,
                    isSelected && styles.selectedMotorcycleCard,
                  ]}
                >
                  <View style={styles.motorcycleInfo}>
                    <Text style={styles.motorcycleName}>
                      {motorcycle.brand?.name ?? "Motorcycle"}{" "}
                      {motorcycle.model}
                    </Text>

                    <Text style={styles.motorcycleDetails}>
                      Plate: {motorcycle.plate_number || "Not provided"}
                    </Text>

                    <Text style={styles.motorcycleDetails}>
                      Fuel:{" "}
                      {motorcycle.fuel_type
                        ? motorcycle.fuel_type.charAt(0).toUpperCase() +
                          motorcycle.fuel_type.slice(1)
                        : "Not specified"}
                    </Text>

                    {(motorcycle.is_main === true ||
                      motorcycle.is_main === 1) && (
                      <Text style={styles.mainMotorcycleLabel}>
                        MAIN MOTORCYCLE
                      </Text>
                    )}
                  </View>

                  <View
                    style={[
                      styles.selectionIndicator,
                      isSelected && styles.selectedIndicator,
                    ]}
                  >
                    {isSelected && <Text style={styles.selectionCheck}>✓</Text>}
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Choose a mechanic</Text>
          <Text style={styles.sectionDescription}>
            Select an available mechanic for your motorcycle problem.
          </Text>

          {isLoadingMechanics ? (
            <ActivityIndicator color={COLORS.primary} size="large" />
          ) : mechanicError ? (
            <TouchableOpacity onPress={() => void loadMechanics()}>
              <Text style={styles.garageError}>{mechanicError}</Text>
              <Text style={styles.retryButtonText}>TAP TO RETRY</Text>
            </TouchableOpacity>
          ) : mechanics.length === 0 ? (
            <Text style={styles.garageStateText}>
              No available mechanics were found.
            </Text>
          ) : (
            mechanics.map((mechanic) => {
              const selected = selectedMechanicId === mechanic.id;
              const fee = Number(mechanic.diagnostic_fee_base);

              return (
                <TouchableOpacity
                  key={mechanic.id}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  activeOpacity={0.8}
                  onPress={() => setSelectedMechanicId(mechanic.id)}
                  style={[
                    styles.motorcycleCard,
                    selected && styles.selectedMotorcycleCard,
                  ]}
                >
                  <View style={styles.motorcycleInfo}>
                    <Text style={styles.motorcycleName}>{mechanic.name}</Text>

                    <Text style={styles.motorcycleDetails}>
                      {mechanic.shop_name || "Independent mechanic"}
                    </Text>

                    <Text style={styles.motorcycleDetails}>
                      Specialty: {mechanic.specialization || "General repairs"}
                    </Text>

                    <Text style={styles.motorcycleDetails}>
                      Diagnostic fee:{" "}
                      {Number.isFinite(fee)
                        ? `₱${fee.toLocaleString("en-PH", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`
                        : "Not available"}
                    </Text>

                    <Text style={styles.mechanicBadge}>
                      {mechanic.is_verified ? "✓ Verified" : "Not verified"}
                      {mechanic.is_24_7 ? " · 24/7" : ""}
                      {mechanic.offers_towing ? " · Towing" : ""}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.selectionIndicator,
                      selected && styles.selectedIndicator,
                    ]}
                  >
                    {selected && <Text style={styles.selectionCheck}>✓</Text>}
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Describe the problem</Text>

          <Text style={styles.inputHint}>
            Minimum 10 characters. Explain what happened.
          </Text>

          <TextInput
            accessibilityLabel="Describe your motorcycle problem"
            value={issueDescription}
            onChangeText={setIssueDescription}
            placeholder="Example: My engine suddenly stopped while riding..."
            placeholderTextColor="#A895B5"
            multiline
            textAlignVertical="top"
            maxLength={1000}
            style={styles.input}
          />

          <Text style={styles.characterCount}>
            {issueDescription.length}/1000 characters
          </Text>
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Find roadside assistance"
          activeOpacity={0.8}
          onPress={handleFindAssistance}
          style={styles.submitButton}
        >
          <Text style={styles.submitButtonText}>FIND ROADSIDE ASSISTANCE</Text>
        </TouchableOpacity>

        <Text style={styles.footerNote}>
          Your garage is connected. Mechanic discovery and SOS submission are
          the next steps.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
