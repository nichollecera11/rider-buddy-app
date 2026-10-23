import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkBg,
  },
  content: {
    padding: SPACING.five,
    paddingBottom: SPACING.xl,
  },

  // Header
  eyebrow: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  title: {
    color: COLORS.textLight,
    fontSize: 28,
    fontWeight: "900",
    marginTop: SPACING.sm,
  },
  subtitle: {
    color: "#C8BBD1",
    fontSize: 15,
    lineHeight: 22,
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },

  // Sections
  section: {
    backgroundColor: COLORS.accentPurple,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: "#613C7A",
  },
  sectionTitle: {
    color: COLORS.textLight,
    fontSize: 17,
    fontWeight: "800",
  },
  sectionDescription: {
    color: "#E0D4E8",
    fontSize: 14,
    lineHeight: 20,
    marginTop: SPACING.sm,
  },
  inputHint: {
    color: "#E0D4E8",
    fontSize: 13,
    lineHeight: 19,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },

  // Issue description
  input: {
    minHeight: 120,
    backgroundColor: COLORS.darkBg,
    borderWidth: 1,
    borderColor: "#795A8D",
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    color: COLORS.textLight,
    fontSize: 15,
    lineHeight: 22,
  },
  characterCount: {
    color: "#C8BBD1",
    fontSize: 12,
    textAlign: "right",
    marginTop: SPACING.sm,
  },

  // Primary action
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 54,
  },
  submitButtonText: {
    color: COLORS.darkBg,
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0.4,
    textAlign: "center",
  },

  // Footer
  footerNote: {
    color: "#C8BBD1",
    fontSize: 12,
    textAlign: "center",
    marginTop: SPACING.md,
    lineHeight: 18,
  },

  garageState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    gap: 10,
  },
  garageStateText: {
    color: "#E0D4E8",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
  },
  garageHint: {
    color: "#C8BBD1",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
  },
  garageError: {
    color: "#FFB4AB",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  retryButtonText: {
    color: COLORS.darkBg,
    fontSize: 13,
    fontWeight: "900",
  },
  motorcycleCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: SPACING.md,
    marginTop: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#795A8D",
    backgroundColor: COLORS.darkBg,
  },
  selectedMotorcycleCard: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    backgroundColor: "#382047",
  },
  motorcycleInfo: {
    flex: 1,
    paddingRight: SPACING.sm,
  },
  motorcycleName: {
    color: COLORS.textLight,
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 21,
  },
  motorcycleDetails: {
    color: "#C8BBD1",
    fontSize: 13,
    marginTop: 5,
  },
  mainMotorcycleLabel: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
    marginTop: SPACING.sm,
  },
  selectionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#A895B5",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedIndicator: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  selectionCheck: {
    color: COLORS.darkBg,
    fontWeight: "900",
    fontSize: 15,
  },

  mechanicBadge: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "800",
    marginTop: SPACING.sm,
  },
});
