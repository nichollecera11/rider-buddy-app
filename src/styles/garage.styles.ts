import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";

export const garageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkBg,
  },

  scrollContent: {
    padding: SPACING.md,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },

  headerSubtitle: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginBottom: SPACING.lg,
  },

  bikeHeaderCard: {
    backgroundColor: COLORS.accentPurple,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
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
    color: COLORS.textLight,
    fontSize: 20,
    fontWeight: "900",
    marginTop: SPACING.xs,
  },

  bikeDetails: {
    color: COLORS.textLight,
    fontSize: 13,
    marginTop: SPACING.xs,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textLight,
    marginBottom: SPACING.md,
  },

  healthCard: {
    backgroundColor: COLORS.accentPurple,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },

  healthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },

  healthName: {
    color: COLORS.textLight,
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
    backgroundColor: COLORS.darkBg,
    borderRadius: RADIUS.full,
    overflow: "hidden",
  },

  fillBar: {
    height: "100%",
    borderRadius: RADIUS.full,
  },
});
