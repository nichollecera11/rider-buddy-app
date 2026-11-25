import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";

export const motorcycleRegisterStyles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.bgLight,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.four,
    paddingVertical: SPACING.two,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backText: {
    color: COLORS.darkBg,
    fontSize: 34,
    fontWeight: "500",
  },
  topTitle: {
    color: COLORS.textDark,
    fontSize: 15,
    fontWeight: "800",
  },
  scrollContent: {
    padding: SPACING.four,
    paddingBottom: 50,
  },
  pageTitle: {
    color: COLORS.textDark,
    fontSize: 24,
    fontWeight: "900",
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: SPACING.xs,
    marginBottom: SPACING.four,
  },
  section: {
    backgroundColor: COLORS.cardWhite,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.lg,
    padding: SPACING.four,
    marginBottom: SPACING.three,
  },
  sectionTitle: {
    color: COLORS.accentPurple,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: SPACING.four,
  },
  field: {
    marginBottom: SPACING.three,
  },
  label: {
    color: COLORS.textDark,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: SPACING.xs,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.three,
    color: COLORS.textDark,
    fontSize: 13,
    backgroundColor: COLORS.bgLight,
  },
  selectInput: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.three,
    backgroundColor: COLORS.bgLight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: {
    color: COLORS.textDark,
    fontSize: 13,
    fontWeight: "600",
  },
  placeholder: {
    color: COLORS.textMuted,
    fontWeight: "400",
  },
  selectArrow: {
    color: COLORS.accentPurple,
    fontSize: 20,
  },
  choiceContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.two,
    marginBottom: SPACING.four,
  },
  choice: {
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.three,
    paddingVertical: SPACING.two,
    backgroundColor: COLORS.bgLight,
  },
  choiceSelected: {
    backgroundColor: COLORS.softPurple,
    borderColor: COLORS.accentPurple,
  },
  choiceText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: "700",
  },
  choiceTextSelected: {
    color: COLORS.accentPurple,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.three,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  switchTextContainer: {
    flex: 1,
    paddingRight: SPACING.two,
  },
  switchTitle: {
    color: COLORS.textDark,
    fontSize: 12,
    fontWeight: "800",
  },
  switchDescription: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: SPACING.xs,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: SPACING.four,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    marginTop: SPACING.two,
  },
  disabledButton: {
    opacity: 0.65,
  },
  submitButtonText: {
    color: COLORS.darkBg,
    fontSize: 14,
    fontWeight: "900",
  },
  footerNote: {
    color: COLORS.textMuted,
    textAlign: "center",
    fontSize: 10,
    marginTop: SPACING.three,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.cardWhite,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.four,
    maxHeight: "75%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.three,
  },
  modalTitle: {
    color: COLORS.textDark,
    fontSize: 16,
    fontWeight: "900",
  },
  modalClose: {
    color: COLORS.textMuted,
    fontSize: 20,
    padding: SPACING.xs,
  },
  loader: {
    padding: SPACING.six,
  },
  emptyText: {
    color: COLORS.textMuted,
    textAlign: "center",
    padding: SPACING.four,
  },
  brandItem: {
    paddingVertical: SPACING.four,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brandName: {
    color: COLORS.textDark,
    fontSize: 14,
    fontWeight: "600",
  },
  brandCheck: {
    color: COLORS.success,
    fontSize: 18,
    fontWeight: "900",
  },
});
