import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
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
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useAuth();

  const handleSubmit = async () => {
    if (isRegistering && !name.trim()) {
      Alert.alert("Required", "Please enter your full name.");
      return;
    }

    if (!email.trim() || !password) {
      Alert.alert("Required", "Please enter email and password.");
      return;
    }

    if (isRegistering && password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Your passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      if (isRegistering) {
        await register(name.trim(), email.trim(), password, confirmPassword);

        Alert.alert(
          "Account Created Successfully!",
          "Your Rider Buddy account has been created. You can now sign in using your registered email and password.",
          [
            {
              text: "Continue to Sign In",
              onPress: () => {
                setIsRegistering(false);
                setPassword("");
                setConfirmPassword("");
                setName("");
              },
            },
          ],
          { cancelable: false },
        );
      } else {
        await login(email.trim(), password);
      }
    } catch (error: any) {
      console.log(
        "[AUTH ERROR]",
        JSON.stringify(error.response?.data ?? error.message, null, 2),
      );

      const message =
        error.response?.data?.errors?.email?.[0] ??
        error.response?.data?.message ??
        "Something went wrong. Please try again.";

      Alert.alert(
        isRegistering ? "Registration Failed" : "Login Failed",
        message,
      );
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = () => {
    setIsRegistering(!isRegistering);
    setName("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.brandContainer}>
        <Image
          source={require("../../../assets/images/rider_buddy_temp.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={styles.brandTitle}>RIDER BUDDY</Text>
        <Text style={styles.brandTagline}>Kasama Mo sa Bawat Biyahe.</Text>
      </View>

      <View style={styles.card}>
        <View style={{ flexDirection: "row", marginBottom: 20 }}>
          <TouchableOpacity
            onPress={() => setIsRegistering(false)}
            style={{
              flex: 1,
              padding: 12,
              alignItems: "center",
              borderBottomWidth: !isRegistering ? 2 : 0,
              borderBottomColor: COLORS.primary,
            }}
          >
            <Text style={{ color: COLORS.darkBg, fontWeight: "bold" }}>
              SIGN IN
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsRegistering(true)}
            style={{
              flex: 1,
              padding: 12,
              alignItems: "center",
              borderBottomWidth: isRegistering ? 2 : 0,
              borderBottomColor: COLORS.primary,
            }}
          >
            <Text style={{ color: COLORS.darkBg, fontWeight: "bold" }}>
              REGISTER
            </Text>
          </TouchableOpacity>
        </View>

        {isRegistering && (
          <>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="person-outline"
                size={20}
                color={COLORS.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Your full name"
                placeholderTextColor={COLORS.textMuted}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          </>
        )}

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
            placeholder="yourname@example.com"
            placeholderTextColor={COLORS.textMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
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
            autoComplete={isRegistering ? "new-password" : "current-password"}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={COLORS.textMuted}
            />
          </TouchableOpacity>
        </View>

        {isRegistering && (
          <>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={COLORS.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor={COLORS.textMuted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                autoComplete="new-password"
              />
            </View>
          </>
        )}

        <TouchableOpacity
          style={[styles.loginBtn, submitting && styles.btnDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={COLORS.darkBg} />
          ) : (
            <Text style={styles.loginBtnText}>
              {isRegistering ? "CREATE ACCOUNT" : "SIGN IN"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={switchMode} style={{ marginTop: 16 }}>
          <Text style={{ textAlign: "center", color: COLORS.textMuted }}>
            {isRegistering
              ? "Already have an account? Sign in"
              : "New to Rider Buddy? Create an account"}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText}>Trust-First Motorcycle Ecosystem 🇵🇭</Text>
    </KeyboardAvoidingView>
  );
}
