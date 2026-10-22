import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: 50,
    paddingBottom: 40,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  greeting: {
    fontSize: 13,
    color: COLORS.secondary,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  userName: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    gap: 10,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.cardDark,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },

  // Motorcycle Switcher Badge
  bikeSelectorCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1E293B",
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: "#334155",
  },
  bikeInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  bikeName: {
    color: COLORS.textPrimary,
    fontWeight: "800",
    fontSize: 15,
  },
  bikePlate: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },

  // Hero LTO Banner
  heroBanner: {
    backgroundColor: COLORS.cardDark,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.success,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  heroBadge: {
    backgroundColor: "rgba(76, 175, 80, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  heroBadgeText: {
    color: COLORS.success,
    fontSize: 11,
    fontWeight: "800",
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  heroSubtext: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },

  // Section Header
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },

  // 2x4 Action Grid
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14,
    marginBottom: SPACING.xl,
  },
  gridItem: {
    width: "23%",
    alignItems: "center",
  },
  gridIconBox: {
    width: 58,
    height: 58,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.cardDark,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  gridLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },

  // Recent Activity Card
  activityCard: {
    backgroundColor: COLORS.cardDark,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  activityStatus: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "700",
  },
});
