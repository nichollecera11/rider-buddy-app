import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import client from "../../api/client";
import { COLORS } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";

type Consultation = {
  id: number;
  status: string;
  consultation_type?: string;
  issue_description?: string;
  created_at?: string;
  mechanic?: {
    name?: string;
    specialization?: string;
    shop_name?: string;
  } | null;
  motorcycle?: {
    brand?: string;
    model?: string;
    plate_number?: string;
  } | null;
};

export default function ConsultationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isRider = user?.role === "rider";
  const isMechanic = user?.role === "mechanic";
  const [updating, setUpdating] = useState(false);
  const canAccept = isMechanic && consultation?.status === "pending";

  //   useEffect(() => {
  //     console.log("Logged-in user:", user);
  //   }, [user]);

  useEffect(() => {
    let active = true;

    async function loadConsultation() {
      setLoading(true);
      setError("");

      try {
        const response = await client.get(`/consultations/${id}`);

        if (active) {
          setConsultation(response.data.data);
        }
      } catch (err) {
        if (active) {
          setError("Couldn't load this consultation. Please try again.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (id) {
      void loadConsultation();
    }

    return () => {
      active = false;
    };
  }, [id]);

  const statusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "ongoing":
        return COLORS.success;
      case "pending":
        return COLORS.warning;
      case "accepted":
        return COLORS.accentPurple;
      case "completed":
        return COLORS.success;
      case "cancelled":
        return COLORS.danger;
      default:
        return COLORS.textMuted;
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.bgLight,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack.Screen options={{ title: "Consultation Details" }} />

        <ActivityIndicator size="large" color={COLORS.accentPurple} />
        <Text style={{ marginTop: 12, color: COLORS.textMuted }}>
          Loading consultation...
        </Text>
      </SafeAreaView>
    );
  }

  if (error || !consultation) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.bgLight,
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <Stack.Screen options={{ title: "Consultation Details" }} />
        <Text
          style={{
            color: COLORS.danger,
            textAlign: "center",
            fontSize: 15,
          }}
        >
          {error || "Consultation not found."}
        </Text>

        <TouchableOpacity
          onPress={() => {
            setError("Please go back and reopen this request.");
          }}
          style={{
            marginTop: 16,
            backgroundColor: COLORS.accentPurple,
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "700" }}>
            Back to Requests
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleAcceptRequest = async () => {
    if (!consultation || !canAccept || updating) {
      return;
    }

    setUpdating(true);

    try {
      const response = await client.patch(`/consultations/${consultation.id}`, {
        status: "accepted",
      });

      setConsultation((current) =>
        current
          ? { ...current, ...response.data.data, status: "accepted" }
          : response.data.data,
      );

      Alert.alert("Request accepted", "You have accepted this consultation.");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.status?.[0] ||
        "Unable to accept this request. Please try again.";

      Alert.alert("Unable to accept request", message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.bgLight }}
      edges={["top"]}
    >
      <Stack.Screen options={{ title: `Request #${consultation.id}` }} />

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Text
          style={{
            color: COLORS.accentPurple,
            fontSize: 12,
            fontWeight: "800",
            letterSpacing: 1.5,
          }}
        >
          RIDER BUDDY
        </Text>

        <Text
          style={{
            color: COLORS.textDark,
            fontSize: 28,
            fontWeight: "800",
            marginTop: 8,
          }}
        >
          Request #{consultation.id}
        </Text>

        <View
          style={{
            alignSelf: "flex-start",
            marginTop: 12,
            backgroundColor: `${statusColor(consultation.status)}18`,
            borderRadius: 20,
            paddingHorizontal: 14,
            paddingVertical: 8,
          }}
        >
          <Text
            style={{
              color: statusColor(consultation.status),
              fontWeight: "800",
              textTransform: "capitalize",
            }}
          >
            {consultation.status}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: COLORS.cardWhite,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: COLORS.borderLight,
            padding: 18,
            marginTop: 24,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "800",
              color: COLORS.textMuted,
              letterSpacing: 1,
            }}
          >
            REQUEST DETAILS
          </Text>

          <Text
            style={{
              fontSize: 13,
              color: COLORS.textMuted,
              marginTop: 14,
              textTransform: "uppercase",
            }}
          >
            {consultation.consultation_type ?? "Consultation"}
          </Text>

          <Text
            style={{
              fontSize: 16,
              lineHeight: 24,
              color: COLORS.textDark,
              marginTop: 8,
            }}
          >
            {consultation.issue_description || "No issue description provided."}
          </Text>

          {consultation.created_at ? (
            <Text
              style={{
                color: COLORS.textMuted,
                fontSize: 12,
                marginTop: 16,
              }}
            >
              Created: {consultation.created_at}
            </Text>
          ) : null}
        </View>

        <View
          style={{
            backgroundColor: COLORS.cardWhite,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: COLORS.borderLight,
            padding: 18,
            marginTop: 16,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "800",
              color: COLORS.textMuted,
              letterSpacing: 1,
            }}
          >
            ASSIGNED MECHANIC
          </Text>

          <Text
            style={{
              fontSize: 17,
              fontWeight: "800",
              color: COLORS.textDark,
              marginTop: 10,
            }}
          >
            {consultation.mechanic?.name || "Mechanic details unavailable"}
          </Text>

          {consultation.mechanic?.specialization ? (
            <Text style={{ color: COLORS.textMuted, marginTop: 5 }}>
              {consultation.mechanic.specialization}
            </Text>
          ) : null}

          {consultation.mechanic?.shop_name ? (
            <Text style={{ color: COLORS.textMuted, marginTop: 3 }}>
              {consultation.mechanic.shop_name}
            </Text>
          ) : null}
        </View>

        <View
          style={{
            backgroundColor: COLORS.cardWhite,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: COLORS.borderLight,
            padding: 18,
            marginTop: 16,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "800",
              color: COLORS.textMuted,
              letterSpacing: 1,
            }}
          >
            MOTORCYCLE
          </Text>

          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: COLORS.textDark,
              marginTop: 10,
            }}
          >
            {consultation.motorcycle
              ? `${consultation.motorcycle.brand ?? ""} ${consultation.motorcycle.model ?? ""}`.trim() ||
                "Motorcycle details unavailable"
              : "Motorcycle details unavailable"}
          </Text>

          {consultation.motorcycle?.plate_number ? (
            <Text style={{ color: COLORS.textMuted, marginTop: 5 }}>
              Plate: {consultation.motorcycle.plate_number}
            </Text>
          ) : null}
        </View>

        {canAccept ? (
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={updating}
            onPress={handleAcceptRequest}
            style={{
              marginTop: 20,
              paddingVertical: 16,
              borderRadius: 14,
              backgroundColor: COLORS.accentPurple,
              alignItems: "center",
              opacity: updating ? 0.6 : 1,
            }}
          >
            {updating ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 16,
                  fontWeight: "800",
                }}
              >
                Accept Request
              </Text>
            )}
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
