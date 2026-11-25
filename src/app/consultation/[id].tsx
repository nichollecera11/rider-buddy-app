import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
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
  const router = useRouter();
  const { user } = useAuth();
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isRider = user?.role === "rider";
  const isMechanic = user?.role === "mechanic";
  const [updating, setUpdating] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [qrToken, setQrToken] = useState("");
  const [qrLoading, setQrLoading] = useState(false);
  const [qrExpiresIn, setQrExpiresIn] = useState(0);
  const [pendingQrScan, setPendingQrScan] = useState<any>(null);
  const [checkingQrScan, setCheckingQrScan] = useState(false);
  const canAccept = isMechanic && consultation?.status === "pending";

  //   useEffect(() => {
  //     console.log("Logged-in user:", user);
  //   }, [user]);

  const fetchConsultation = useCallback(async () => {
    const response = await client.get(`/consultations/${id}`);
    return response.data.data as Consultation;
  }, [id]);

  useEffect(() => {
    let active = true;

    async function loadConsultation() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchConsultation();

        if (active) {
          setConsultation(data);
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
  }, [fetchConsultation]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      let requestInProgress = false;
      let shouldStop = false;

      let interval: ReturnType<typeof setInterval> | undefined;

      async function pollConsultation() {
        if (!active || requestInProgress || shouldStop) {
          return;
        }

        requestInProgress = true;

        try {
          const data = await fetchConsultation();

          if (!active) {
            return;
          }

          setConsultation(data);

          if (data.status === "completed") {
            shouldStop = true;

            if (interval) {
              clearInterval(interval);
            }
          }
        } catch (err: any) {
          if (err?.response?.status === 404) {
            shouldStop = true;

            if (interval) {
              clearInterval(interval);
            }

            if (active) {
              setConsultation(null);
              setError("This consultation is no longer available.");
            }
          }
        } finally {
          requestInProgress = false;
        }
      }

      void pollConsultation();

      interval = setInterval(() => {
        void pollConsultation();
      }, 5000);

      return () => {
        active = false;

        if (interval) {
          clearInterval(interval);
        }
      };
    }, [fetchConsultation]),
  );

  useEffect(() => {
    if (!qrToken || qrExpiresIn <= 0) return;

    const timer = setInterval(() => {
      setQrExpiresIn((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          setQrToken("");
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [qrToken]);
  useEffect(() => {
    if (!qrToken || !consultation || pendingQrScan) return;

    let active = true;
    let requestInProgress = false;

    const checkForMechanicScan = async () => {
      if (requestInProgress) return;

      requestInProgress = true;
      setCheckingQrScan(true);

      try {
        const response = await client.get(
          `/consultations/${consultation.id}/qr-challenge/pending`,
        );

        if (active && response.data.data) {
          setPendingQrScan(response.data.data);
        }
      } catch (error: any) {
        if (active) {
          console.error(
            "QR scan check failed:",
            error.response?.data || error.message,
          );
        }
      } finally {
        requestInProgress = false;

        if (active) {
          setCheckingQrScan(false);
        }
      }
    };

    void checkForMechanicScan();

    const interval = setInterval(() => {
      void checkForMechanicScan();
    }, 3000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [qrToken, consultation?.id, pendingQrScan]);

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

  const handleGenerateQr = async () => {
    if (!consultation) return;

    try {
      setQrLoading(true);
      setQrToken("");

      const response = await client.post(
        `/consultations/${consultation.id}/qr-challenge`,
      );

      setQrToken(response.data.data.token);
      setQrExpiresIn(response.data.data.expires_in_seconds);

      Alert.alert(
        "QR Code Generated",
        "Show this QR code to your assigned mechanic. It expires in 60 seconds.",
      );
    } catch (error: any) {
      console.error(
        "QR generation failed:",
        error.response?.data || error.message,
      );

      Alert.alert(
        "Unable to Generate QR",
        error.response?.data?.message ||
          "Something went wrong while generating your QR code.",
      );
    } finally {
      setQrLoading(false);
    }
  };
  const handleConfirmQrArrival = async (confirmed: boolean) => {
    if (!consultation || !pendingQrScan) return;

    try {
      setUpdating(true);

      await client.post(
        `/consultations/${consultation.id}/qr-challenge/confirm`,
        {
          challenge_id: pendingQrScan.challenge_id,
          confirmed,
        },
      );

      setPendingQrScan(null);

      if (confirmed) {
        setQrToken("");
        setQrExpiresIn(0);

        const response = await client.get(`/consultations/${consultation.id}`);

        setConsultation(response.data.data);

        Alert.alert(
          "Arrival Confirmed",
          "Mechanic arrival has been verified. Your consultation is now ongoing.",
        );
      } else {
        setQrToken("");
        setQrExpiresIn(0);

        Alert.alert(
          "Scan Rejected",
          "The mechanic's scan was rejected. You can generate a new QR code when ready.",
        );
      }
    } catch (error: any) {
      console.error(
        "QR confirmation failed:",
        error.response?.data || error.message,
      );

      Alert.alert(
        "Confirmation Failed",
        error.response?.data?.message ||
          "Unable to process the mechanic's arrival confirmation.",
      );
    } finally {
      setUpdating(false);
    }
  };
  const handleSubmitCancellation = async () => {
    const reason = cancellationReason.trim();

    if (reason.length < 10) {
      Alert.alert(
        "Reason Required",
        "Please provide at least 10 characters explaining why you need to cancel.",
      );
      return;
    }

    if (reason.length > 1000) {
      Alert.alert(
        "Reason Too Long",
        "Your cancellation reason cannot exceed 1000 characters.",
      );
      return;
    }

    if (!consultation || cancelling) return;

    setCancelling(true);

    try {
      await client.delete(`/consultations/${consultation.id}`, {
        data: { reason },
      });

      setCancelModalVisible(false);
      setCancellationReason("");

      Alert.alert(
        "Request Cancelled",
        "Your SOS request has been cancelled successfully.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)/requests"),
          },
        ],
      );
    } catch (error: any) {
      Alert.alert(
        "Cancellation Failed",
        error?.response?.data?.message ||
          "Unable to cancel this request. Please try again.",
      );
    } finally {
      setCancelling(false);
    }
  };

  const handleCancelRequest = () => {
    if (
      !consultation ||
      !isRider ||
      !["pending", "accepted"].includes(consultation.status) ||
      cancelling
    ) {
      return;
    }

    if (consultation.status === "accepted") {
      Alert.alert(
        "Contact Your Mechanic First",
        "Your mechanic has already accepted this request. Please call or message the mechanic first to explain that you no longer need assistance.",
        [
          {
            text: "Keep Request",
            style: "cancel",
          },
          {
            text: "Proceed to Cancel",
            style: "destructive",
            onPress: () => {
              setCancellationReason("");
              setCancelModalVisible(true);
            },
          },
        ],
      );

      return;
    }

    Alert.alert(
      "Cancel SOS Request?",
      "Are you sure you want to cancel this request? The mechanic will no longer be able to accept it.",
      [
        {
          text: "Keep Request",
          style: "cancel",
        },
        {
          text: "Cancel Request",
          style: "destructive",
          onPress: async () => {
            setCancelling(true);

            try {
              await client.delete(`/consultations/${consultation.id}`);

              Alert.alert(
                "Request Cancelled",
                "Your SOS request has been cancelled.",
                [
                  {
                    text: "OK",
                    onPress: () => router.replace("/(tabs)/requests"),
                  },
                ],
              );
            } catch (error: any) {
              const message =
                error?.response?.data?.message ||
                "Unable to cancel this request. It may have already been accepted.";

              Alert.alert("Cancellation Failed", message);

              try {
                const latest = await fetchConsultation();
                setConsultation(latest);
              } catch {
                // The consultation may no longer be available.
              }
            } finally {
              setCancelling(false);
            }
          },
        },
      ],
    );
  };

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

        {isRider && consultation.status === "accepted" && (
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
              MECHANIC ARRIVAL VERIFICATION
            </Text>

            <Text
              style={{
                color: COLORS.textDark,
                marginTop: 10,
                lineHeight: 21,
              }}
            >
              Generate a QR code for your assigned mechanic to scan when they
              arrive.
            </Text>

            {qrToken ? (
              <View style={{ alignItems: "center", marginTop: 20 }}>
                <QRCode value={qrToken} size={220} />
                <Text
                  style={{
                    color: qrExpiresIn <= 10 ? COLORS.danger : COLORS.textMuted,
                    fontSize: 15,
                    fontWeight: "800",
                    marginTop: 12,
                  }}
                >
                  QR expires in {qrExpiresIn} seconds
                </Text>

                <Text
                  style={{
                    color: COLORS.textMuted,
                    marginTop: 12,
                    textAlign: "center",
                  }}
                >
                  This QR code expires after 60 seconds.
                </Text>
              </View>
            ) : null}

            {pendingQrScan ? (
              <View
                style={{
                  marginTop: 20,
                  padding: 16,
                  borderRadius: 14,
                  backgroundColor: COLORS.softPurple,
                  borderWidth: 1,
                  borderColor: COLORS.accentPurple,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "800",
                    color: COLORS.textDark,
                  }}
                >
                  Mechanic Scan Detected!
                </Text>

                <Text
                  style={{
                    color: COLORS.textDark,
                    marginTop: 10,
                    lineHeight: 21,
                  }}
                >
                  {pendingQrScan.mechanic?.name || "Your assigned mechanic"} has
                  scanned your QR code.
                </Text>

                {pendingQrScan.mechanic?.shop_name ? (
                  <Text style={{ color: COLORS.textMuted, marginTop: 5 }}>
                    {pendingQrScan.mechanic.shop_name}
                  </Text>
                ) : null}

                <Text
                  style={{
                    color: COLORS.textMuted,
                    marginTop: 12,
                    fontSize: 12,
                  }}
                >
                  Please confirm whether your mechanic has physically arrived.
                </Text>

                <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    disabled={updating}
                    onPress={() => handleConfirmQrArrival(false)}
                    style={{
                      flex: 1,
                      paddingVertical: 14,
                      borderRadius: 12,
                      backgroundColor: COLORS.danger,
                      alignItems: "center",
                      opacity: updating ? 0.6 : 1,
                    }}
                  >
                    <Text style={{ color: "#FFFFFF", fontWeight: "800" }}>
                      Reject
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    disabled={updating}
                    onPress={() => handleConfirmQrArrival(true)}
                    style={{
                      flex: 1,
                      paddingVertical: 14,
                      borderRadius: 12,
                      backgroundColor: COLORS.success,
                      alignItems: "center",
                      opacity: updating ? 0.6 : 1,
                    }}
                  >
                    <Text style={{ color: "#FFFFFF", fontWeight: "800" }}>
                      Confirm Arrival
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleGenerateQr}
              disabled={qrLoading}
              style={{
                marginTop: 18,
                paddingVertical: 16,
                borderRadius: 14,
                backgroundColor: COLORS.accentPurple,
                alignItems: "center",
                opacity: qrLoading ? 0.6 : 1,
              }}
            >
              {qrLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 16,
                    fontWeight: "800",
                  }}
                >
                  Generate Arrival QR
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}

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
        {isRider && ["pending", "accepted"].includes(consultation.status) && (
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={cancelling}
            onPress={handleCancelRequest}
            style={{
              marginTop: 16,
              paddingVertical: 16,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: COLORS.danger,
              alignItems: "center",
              opacity: cancelling ? 0.6 : 1,
            }}
          >
            {cancelling ? (
              <ActivityIndicator color={COLORS.danger} />
            ) : (
              <Text
                style={{
                  color: COLORS.danger,
                  fontSize: 16,
                  fontWeight: "800",
                }}
              >
                Cancel Request
              </Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
      <Modal
        visible={cancelModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          if (!cancelling) {
            setCancelModalVisible(false);
          }
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 20,
              padding: 22,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "800",
                color: "#281137",
                marginBottom: 8,
              }}
            >
              Cancel SOS Request?
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: "#666666",
                marginBottom: 16,
                lineHeight: 21,
              }}
            >
              Please tell us why you no longer need this assistance. Your
              mechanic will be informed that the request has been cancelled.
            </Text>

            <TextInput
              value={cancellationReason}
              onChangeText={setCancellationReason}
              placeholder="Enter your cancellation reason..."
              multiline
              maxLength={1000}
              editable={!cancelling}
              textAlignVertical="top"
              style={{
                minHeight: 120,
                borderWidth: 1,
                borderColor: "#D8D0DF",
                borderRadius: 12,
                padding: 12,
                fontSize: 15,
                color: "#281137",
                marginBottom: 8,
              }}
            />

            <Text
              style={{
                textAlign: "right",
                color: "#777777",
                fontSize: 12,
                marginBottom: 18,
              }}
            >
              {cancellationReason.length}/1000 characters
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              disabled={cancelling}
              onPress={handleSubmitCancellation}
              style={{
                backgroundColor: COLORS.danger,
                paddingVertical: 15,
                borderRadius: 12,
                alignItems: "center",
                marginBottom: 10,
                opacity: cancelling ? 0.6 : 1,
              }}
            >
              {cancelling ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontWeight: "800",
                    fontSize: 15,
                  }}
                >
                  Confirm Cancellation
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              disabled={cancelling}
              onPress={() => setCancelModalVisible(false)}
              style={{
                paddingVertical: 12,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#281137",
                  fontWeight: "700",
                  fontSize: 14,
                }}
              >
                Keep Request
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
