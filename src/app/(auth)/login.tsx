import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { styles } from "../../styles/login.styles";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Required", "Please enter email and password.");
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim(), password);
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Invalid email or password.";
      Alert.alert("Login Failed", message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.brandContainer}>
        <View style={styles.logoBadge}>
          <Ionicons name="bicycle-outline" size={42} color={COLORS.primary} />
        </View>
        <Text style={styles.brandTitle}>RIDER BUDDY</Text>
        <Text style={styles.brandTagline}>
          Kaluwasan ug Transparency sa Dalan
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.inputLabel}>Email Address</Text>
        <View style={styles.inputWrapper}>
          <Ionicons
            name="mail-outline"
            size={20}
            color={COLORS.textMuted}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="authtest1@example.com"
            placeholderTextColor={COLORS.textMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <Text style={styles.inputLabel}>Password</Text>
        <View style={styles.inputWrapper}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={COLORS.textMuted}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={COLORS.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={COLORS.textMuted}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.loginBtn, submitting && styles.btnDisabled]}
          onPress={handleLogin}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={COLORS.textPrimary} />
          ) : (
            <Text style={styles.loginBtnText}>SIGN IN</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText}>Trust-First Motorcycle Ecosystem 🇵🇭</Text>
    </KeyboardAvoidingView>
  );
}
