import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
    justifyContent: "center",
    paddingHorizontal: SPACING.lg,
  },
  brandContainer: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.cardDark,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: COLORS.textPrimary,
    letterSpacing: 2,
  },
  brandTagline: {
    fontSize: 13,
    color: COLORS.secondary,
    marginTop: SPACING.xs,
    fontWeight: "600",
  },
  card: {
    backgroundColor: COLORS.cardDark,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  inputLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: SPACING.xs,
    marginTop: SPACING.sm,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputDark,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    paddingHorizontal: SPACING.md,
    height: 50,
    marginBottom: SPACING.sm,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 15,
  },
  loginBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.lg,
    elevation: 3,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  loginBtnText: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 1,
  },
  footerText: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: "center",
    marginTop: SPACING.xl,
  },
});
