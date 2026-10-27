import { StyleSheet } from "react-native";
import { COLORS, SPACING } from "../constants/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgLight,
    justifyContent: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },

  // Rider Buddy branding
  brandContainer: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },

  logoImage: {
    width: 140,
    height: 140,
    resizeMode: "contain",
    marginBottom: SPACING.xs,
  },

  brandTitle: {
    fontSize: 30,
    fontWeight: "900",
    color: COLORS.darkBg,
    letterSpacing: -0.8, // Tight tracking like inDrive for a punchy modern headline
    textAlign: "center",
  },

  brandTagline: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 4,
    fontWeight: "500",
    textAlign: "center",
    letterSpacing: -0.2,
  },

  // Login form card
  card: {
    backgroundColor: COLORS.cardWhite,
    borderRadius: 24, // Smoother rounded squircle corners
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    // Subtle modern shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
  },

  inputLabel: {
    color: COLORS.textDark,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
    marginTop: SPACING.md,
    letterSpacing: -0.2,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F4F6", // Soft, clean input surface like inDrive
    borderRadius: 16, // Pill-like smooth input corners
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.04)",
    paddingHorizontal: SPACING.md,
    height: 54,
    marginBottom: SPACING.xs,
  },

  inputIcon: {
    marginRight: SPACING.sm,
  },

  input: {
    flex: 1,
    color: COLORS.textDark,
    fontSize: 15,
    fontWeight: "600", // Stronger, crisp font weight for typed text
    paddingVertical: 0,
  },

  // Main action button
  loginBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 28, // Fully rounded pill shape like inDrive
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.xl,
    elevation: 2,
  },

  btnDisabled: {
    opacity: 0.6,
  },

  loginBtnText: {
    color: COLORS.darkBg,
    fontSize: 16,
    fontWeight: "800", // Bold, modern button typography
    letterSpacing: -0.3, // Modern tight tracking
  },

  footerText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    marginTop: SPACING.xl,
    lineHeight: 18,
    letterSpacing: -0.2,
  },
});
