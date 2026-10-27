import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";

export const garageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },

  scrollContent: {
    padding: SPACING.md,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },

  headerSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: SPACING.lg,
  },

  bikeHeaderCard: {
    backgroundColor: COLORS.cardDark,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: SPACING.xl,
  },

  primaryBikeLabel: {
    color: COLORS.primary,
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },

  bikeName: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: "900",
    marginTop: SPACING.xs,
  },

  bikeDetails: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: SPACING.xs,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },

  healthCard: {
    backgroundColor: COLORS.cardDark,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },

  healthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },

  healthName: {
    color: COLORS.textPrimary,
    fontWeight: "700",
    fontSize: 14,
    flex: 1,
  },

  healthStatus: {
    fontWeight: "800",
    fontSize: 13,
    flexShrink: 0,
  },

  trackBar: {
    height: 8,
    backgroundColor: "#121212",
    borderRadius: RADIUS.full,
    overflow: "hidden",
  },

  fillBar: {
    height: "100%",
    borderRadius: RADIUS.full,
  },
});
