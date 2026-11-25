import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";

export const garageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgLight,
  },

  scrollContent: {
    paddingHorizontal: SPACING.four,
    paddingTop: SPACING.md,
    paddingBottom: 100,
  },

  // Header
  header: {
    marginBottom: SPACING.four,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: COLORS.textDark,
    letterSpacing: -0.5,
  },

  headerSubtitle: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: SPACING.xs,
  },

  // Section Header
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SPACING.four,
    marginBottom: SPACING.three,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.textDark,
  },

  bikeCount: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.accentPurple,
  },

  // Primary Motorcycle Card
  bikeHeaderCard: {
    backgroundColor: COLORS.darkBg,
    borderRadius: RADIUS.xl,
    padding: SPACING.four,
    marginBottom: SPACING.three,
  },

  primaryBikeLabel: {
    color: COLORS.primary,
    fontWeight: "900",
    fontSize: 9,
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },

  bikeName: {
    color: COLORS.textLight,
    fontSize: 20,
    fontWeight: "900",
    marginTop: SPACING.xs,
  },

  bikeDetails: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 11,
    marginTop: SPACING.sm,
  },

  bikeMeta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: SPACING.two,
    marginTop: SPACING.md,
  },

  bikeMetaText: {
    color: COLORS.textLight,
    fontSize: 10,
    fontWeight: "600",
  },

  // Other Motorcycle Cards
  bikeCard: {
    backgroundColor: COLORS.cardWhite,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.lg,
    padding: SPACING.four,
    marginBottom: SPACING.three,
  },

  bikeCardName: {
    color: COLORS.textDark,
    fontSize: 15,
    fontWeight: "800",
  },

  bikeCardDetails: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: SPACING.xs,
  },

  mainBadge: {
    backgroundColor: "#FFF7CF",
    paddingHorizontal: SPACING.two,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },

  mainBadgeText: {
    color: COLORS.darkBg,
    fontSize: 9,
    fontWeight: "900",
  },

  // Register Button
  registerButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: SPACING.four,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.two,
  },

  registerButtonText: {
    color: COLORS.darkBg,
    fontSize: 13,
    fontWeight: "900",
  },

  // Empty State
  emptyCard: {
    backgroundColor: COLORS.cardWhite,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.lg,
    padding: SPACING.six,
    alignItems: "center",
    marginBottom: SPACING.three,
  },

  emptyTitle: {
    color: COLORS.textDark,
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
    marginTop: SPACING.md,
  },

  emptyText: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: SPACING.xs,
  },

  // Loading and Error
  statusText: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: "center",
    marginVertical: SPACING.four,
  },
});
