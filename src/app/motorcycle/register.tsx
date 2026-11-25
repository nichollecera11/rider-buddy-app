import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Switch,
    Text,
    TextInput,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { fetchBrands, registerMotorcycle } from "../../api/motorcycles";
import { COLORS } from "../../constants/theme";
import { motorcycleRegisterStyles as styles } from "../../styles/motorcycle-register.styles";
import { Brand, RegisterMotorcyclePayload } from "../../types/motorcycle";

const TRANSMISSIONS = [
  { label: "Manual", value: "manual" },
  { label: "Automatic", value: "automatic" },
  { label: "Semi-Automatic", value: "semi_automatic" },
  { label: "Electric / None", value: "none_electric" },
];

const FUEL_TYPES = [
  { label: "Gasoline", value: "gasoline" },
  { label: "Electric", value: "electric" },
];

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "decimal-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
};

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  autoCapitalize = "sentences",
}: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        placeholderTextColor={COLORS.textMuted}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}

export default function RegisterMotorcycleScreen() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [brandModalVisible, setBrandModalVisible] = useState(false);

  const [model, setModel] = useState("");
  const [yearModel, setYearModel] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [engineCapacity, setEngineCapacity] = useState("");
  const [transmission, setTransmission] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [color, setColor] = useState("");
  const [engineNumber, setEngineNumber] = useState("");
  const [chassisNumber, setChassisNumber] = useState("");
  const [lastRegistrationDate, setLastRegistrationDate] = useState("");
  const [insuranceExpiry, setInsuranceExpiry] = useState("");
  const [currentOdometer, setCurrentOdometer] = useState("");

  const [isMain, setIsMain] = useState(true);
  const [isActive, setIsActive] = useState(true);

  const [loadingBrands, setLoadingBrands] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadBrands();
  }, []);

  async function loadBrands() {
    try {
      const data = await fetchBrands();
      setBrands(data);
    } catch {
      Alert.alert(
        "Unable to Load Brands",
        "Please check your connection and try again.",
      );
    } finally {
      setLoadingBrands(false);
    }
  }

  function selectOption(
    value: string,
    currentValue: string,
    setter: (value: string) => void,
  ) {
    setter(currentValue === value ? "" : value);
  }

  async function handleRegister() {
    if (!selectedBrand) {
      Alert.alert("Required Field", "Please select a motorcycle brand.");
      return;
    }

    if (!model.trim() || !plateNumber.trim()) {
      Alert.alert(
        "Required Fields",
        "Please enter the motorcycle model and plate number.",
      );
      return;
    }

    if (
      (engineCapacity.trim() && !Number.isInteger(Number(engineCapacity))) ||
      (currentOdometer.trim() && !Number.isInteger(Number(currentOdometer)))
    ) {
      Alert.alert(
        "Invalid Number",
        "Engine capacity and odometer must be whole numbers.",
      );
      return;
    }

    const payload: RegisterMotorcyclePayload = {
      brand_id: selectedBrand.id,
      model: model.trim(),
      plate_number: plateNumber.trim().toUpperCase(),
      is_main: isMain,
      is_active: isActive,
    };

    if (yearModel.trim()) payload.year_model = yearModel.trim();
    if (engineCapacity.trim()) payload.engine_capacity = Number(engineCapacity);
    if (transmission)
      payload.transmission =
        transmission as RegisterMotorcyclePayload["transmission"];
    if (fuelType)
      payload.fuel_type = fuelType as RegisterMotorcyclePayload["fuel_type"];
    if (color.trim()) payload.color = color.trim();
    if (engineNumber.trim()) payload.engine_number = engineNumber.trim();
    if (chassisNumber.trim()) payload.chassis_number = chassisNumber.trim();
    if (lastRegistrationDate.trim())
      payload.last_registration_date = lastRegistrationDate.trim();
    if (insuranceExpiry.trim())
      payload.insurance_expiry = insuranceExpiry.trim();
    if (currentOdometer.trim())
      payload.current_odometer = Number(currentOdometer);

    setSubmitting(true);

    try {
      await registerMotorcycle(payload);

      Alert.alert(
        "Motorcycle Registered",
        "Your motorcycle has been added to your garage.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ],
      );
    } catch (error) {
      const response = (
        error as {
          response?: {
            data?: {
              message?: string;
              errors?: Record<string, string[]>;
            };
          };
        }
      ).response?.data;

      const validationErrors = response?.errors;

      if (validationErrors) {
        const firstError = Object.values(validationErrors)[0]?.[0];

        Alert.alert(
          "Registration Failed",
          firstError || "Please check the information you entered.",
        );
      } else {
        Alert.alert(
          "Registration Failed",
          response?.message || "Something went wrong. Please try again.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  function renderChoice(
    label: string,
    value: string,
    currentValue: string,
    setter: (value: string) => void,
  ) {
    const selected = currentValue === value;

    return (
      <Pressable
        key={value}
        onPress={() => selectOption(value, currentValue, setter)}
        style={[styles.choice, selected && styles.choiceSelected]}
      >
        <Text
          style={[styles.choiceText, selected && styles.choiceTextSelected]}
        >
          {label}
        </Text>
      </Pressable>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          <Text style={styles.topTitle}>Register Motorcycle</Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.pageTitle}>Add Your Motorcycle</Text>
          <Text style={styles.subtitle}>
            Register your motorcycle to manage your garage and request roadside
            assistance.
          </Text>

          {/* BASIC INFORMATION */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Brand *</Text>

              <Pressable
                style={styles.selectInput}
                onPress={() => setBrandModalVisible(true)}
              >
                <Text
                  style={[
                    styles.selectText,
                    !selectedBrand && styles.placeholder,
                  ]}
                >
                  {selectedBrand?.name || "Select motorcycle brand"}
                </Text>
                <Text style={styles.selectArrow}>⌄</Text>
              </Pressable>
            </View>

            <FormField
              label="Model *"
              value={model}
              onChangeText={setModel}
              placeholder="e.g. NMAX, Click 125i, Raider 150"
            />

            <FormField
              label="Year Model"
              value={yearModel}
              onChangeText={setYearModel}
              placeholder="e.g. 2023"
              keyboardType="numeric"
            />

            <FormField
              label="Plate Number *"
              value={plateNumber}
              onChangeText={setPlateNumber}
              placeholder="e.g. ABC1234"
              autoCapitalize="characters"
            />

            <FormField
              label="Color"
              value={color}
              onChangeText={setColor}
              placeholder="e.g. Matte Black"
            />
          </View>

          {/* TECHNICAL INFORMATION */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technical Information</Text>

            <FormField
              label="Engine Capacity (cc)"
              value={engineCapacity}
              onChangeText={setEngineCapacity}
              placeholder="e.g. 155"
              keyboardType="numeric"
            />

            <Text style={styles.label}>Transmission</Text>
            <View style={styles.choiceContainer}>
              {TRANSMISSIONS.map((item) =>
                renderChoice(
                  item.label,
                  item.value,
                  transmission,
                  setTransmission,
                ),
              )}
            </View>

            <Text style={styles.label}>Fuel Type</Text>
            <View style={styles.choiceContainer}>
              {FUEL_TYPES.map((item) =>
                renderChoice(item.label, item.value, fuelType, setFuelType),
              )}
            </View>

            <FormField
              label="Current Odometer (km)"
              value={currentOdometer}
              onChangeText={setCurrentOdometer}
              placeholder="e.g. 12450"
              keyboardType="numeric"
            />
          </View>

          {/* IDENTIFICATION */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vehicle Identification</Text>

            <FormField
              label="Engine Number"
              value={engineNumber}
              onChangeText={setEngineNumber}
              placeholder="Enter engine number"
              autoCapitalize="characters"
            />

            <FormField
              label="Chassis Number"
              value={chassisNumber}
              onChangeText={setChassisNumber}
              placeholder="Enter chassis number"
              autoCapitalize="characters"
            />
          </View>

          {/* REGISTRATION DETAILS */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Registration & Insurance</Text>

            <FormField
              label="Last Registration Date"
              value={lastRegistrationDate}
              onChangeText={setLastRegistrationDate}
              placeholder="YYYY-MM-DD"
              autoCapitalize="none"
            />

            <FormField
              label="Insurance Expiry"
              value={insuranceExpiry}
              onChangeText={setInsuranceExpiry}
              placeholder="YYYY-MM-DD"
              autoCapitalize="none"
            />
          </View>

          {/* PREFERENCES */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>

            <View style={styles.switchRow}>
              <View style={styles.switchTextContainer}>
                <Text style={styles.switchTitle}>
                  Set as Primary Motorcycle
                </Text>
                <Text style={styles.switchDescription}>
                  Use this motorcycle as your main vehicle.
                </Text>
              </View>

              <Switch
                value={isMain}
                onValueChange={setIsMain}
                trackColor={{
                  false: COLORS.borderLight,
                  true: COLORS.accentPurple,
                }}
                thumbColor={COLORS.cardWhite}
              />
            </View>

            <View style={styles.switchRow}>
              <View style={styles.switchTextContainer}>
                <Text style={styles.switchTitle}>Active Motorcycle</Text>
                <Text style={styles.switchDescription}>
                  Mark this motorcycle as currently in use.
                </Text>
              </View>

              <Switch
                value={isActive}
                onValueChange={setIsActive}
                trackColor={{
                  false: COLORS.borderLight,
                  true: COLORS.accentPurple,
                }}
                thumbColor={COLORS.cardWhite}
              />
            </View>
          </View>

          <Pressable
            style={[styles.submitButton, submitting && styles.disabledButton]}
            onPress={handleRegister}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color={COLORS.darkBg} />
            ) : (
              <Text style={styles.submitButtonText}>Register Motorcycle</Text>
            )}
          </Pressable>

          <Text style={styles.footerNote}>
            Fields marked with * are required.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* BRAND SELECTOR */}
      <Modal
        visible={brandModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setBrandModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Motorcycle Brand</Text>

              <Pressable onPress={() => setBrandModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </Pressable>
            </View>

            {loadingBrands ? (
              <ActivityIndicator
                color={COLORS.accentPurple}
                style={styles.loader}
              />
            ) : (
              <FlatList
                data={brands}
                keyExtractor={(item) => String(item.id)}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={
                  <Text style={styles.emptyText}>
                    No motorcycle brands available.
                  </Text>
                }
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.brandItem}
                    onPress={() => {
                      setSelectedBrand(item);
                      setBrandModalVisible(false);
                    }}
                  >
                    <Text style={styles.brandName}>{item.name}</Text>

                    {selectedBrand?.id === item.id && (
                      <Text style={styles.brandCheck}>✓</Text>
                    )}
                  </Pressable>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
