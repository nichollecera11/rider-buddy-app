import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import client from "../../api/client";
import { COLORS } from "../../constants/theme";

type Consultation = {
  id: number;
  status: string;
  consultation_type?: string;
  issue_description?: string;
  mechanic_id?: number;
  mechanic?: {
    id: number;
    name?: string;
    specialization?: string;
    shop_name?: string;
  } | null;
  created_at?: string;
};

export default function RequestsScreen() {
  const [requests, setRequests] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadRequests = useCallback(async (refresh = false) => {
    if (refresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await client.get("/consultations");
      const payload = response.data;

      // Support either { data: [...] } or a nested paginated response.
      const records = Array.isArray(payload.data)
        ? payload.data
        : Array.isArray(payload.data?.data)
          ? payload.data.data
          : null;

      if (!records) {
        throw new Error("Unexpected consultations response format.");
      }

      setRequests(records);
    } catch {
      setError("Couldn't load your requests. Check your connection and retry.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadRequests();
    }, [loadRequests]),
  );

  const statusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "ongoing":
        return COLORS.success;
      case "pending":
        return COLORS.warning;
      case "completed":
        return COLORS.accentPurple;
      case "cancelled":
      case "canceled":
        return COLORS.danger;
      default:
        return COLORS.textMuted;
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.bgLight }}
      edges={["top"]}
    >
      <View
        style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: "800",
            letterSpacing: 1.5,
            color: COLORS.accentPurple,
          }}
        >
          RIDER BUDDY
        </Text>

        <Text
          style={{
            fontSize: 28,
            fontWeight: "800",
            color: COLORS.textDark,
            marginTop: 6,
          }}
        >
          My Requests
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: COLORS.textMuted,
            marginTop: 5,
          }}
        >
          Track your roadside assistance requests.
        </Text>
      </View>

      {loading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color={COLORS.accentPurple} />
          <Text style={{ marginTop: 12, color: COLORS.textMuted }}>
            Loading your requests...
          </Text>
        </View>
      ) : error ? (
        <View style={{ padding: 20, alignItems: "center" }}>
          <Text style={{ color: COLORS.danger, textAlign: "center" }}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={() => void loadRequests()}
            style={{
              marginTop: 16,
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 12,
              backgroundColor: COLORS.accentPurple,
            }}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "700" }}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: 110,
            flexGrow: 1,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => void loadRequests(true)}
              tintColor={COLORS.accentPurple}
            />
          }
          ListEmptyComponent={
            <View style={{ alignItems: "center", paddingTop: 60 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: COLORS.textDark,
                }}
              >
                No requests yet
              </Text>
              <Text
                style={{
                  color: COLORS.textMuted,
                  textAlign: "center",
                  marginTop: 8,
                  lineHeight: 21,
                }}
              >
                Your roadside assistance requests will appear here.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: COLORS.cardWhite,
                borderRadius: 18,
                borderWidth: 1,
                borderColor: COLORS.borderLight,
                padding: 16,
                marginBottom: 12,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "800",
                    color: COLORS.textDark,
                  }}
                >
                  Request #{item.id}
                </Text>

                <View
                  style={{
                    backgroundColor: `${statusColor(item.status)}18`,
                    borderRadius: 20,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                  }}
                >
                  <Text
                    style={{
                      color: statusColor(item.status),
                      fontSize: 12,
                      fontWeight: "800",
                      textTransform: "capitalize",
                    }}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>

              <Text
                style={{
                  color: COLORS.textMuted,
                  fontSize: 12,
                  marginTop: 8,
                  textTransform: "uppercase",
                }}
              >
                {item.consultation_type ?? "Consultation"}
              </Text>

              <Text
                style={{
                  color: COLORS.textDark,
                  fontSize: 14,
                  lineHeight: 21,
                  marginTop: 8,
                }}
              >
                {item.issue_description || "No issue description provided."}
              </Text>
              <View
                style={{
                  marginTop: 16,
                  padding: 12,
                  borderRadius: 12,
                  backgroundColor: COLORS.bgLight,
                  borderWidth: 1,
                  borderColor: COLORS.borderLight,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "800",
                    color: COLORS.textMuted,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  Assigned Mechanic
                </Text>

                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "800",
                    color: COLORS.textDark,
                    marginTop: 6,
                  }}
                >
                  {item.mechanic?.name || "Mechanic details unavailable"}
                </Text>

                {item.mechanic?.specialization ? (
                  <Text
                    style={{
                      fontSize: 13,
                      color: COLORS.textMuted,
                      marginTop: 4,
                    }}
                  >
                    {item.mechanic.specialization}
                  </Text>
                ) : null}

                {item.mechanic?.shop_name ? (
                  <Text
                    style={{
                      fontSize: 13,
                      color: COLORS.textMuted,
                      marginTop: 3,
                    }}
                  >
                    {item.mechanic.shop_name}
                  </Text>
                ) : null}
              </View>

              {item.created_at ? (
                <Text
                  style={{
                    color: COLORS.textMuted,
                    fontSize: 12,
                    marginTop: 12,
                  }}
                >
                  Created: {item.created_at}
                </Text>
              ) : null}
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
