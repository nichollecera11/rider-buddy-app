export const COLORS = {
  // Brand Palette (Rider Buddy - High Contrast Outdoors)
  primary: "#FF6600", // Moto Orange
  secondary: "#00E5FF", // Angkas Cyan

  // Dark Backgrounds & Surfaces
  bgDark: "#0B0F17", // Deep Obsidian
  cardDark: "#161E2E", // Surface Card
  inputDark: "#121824", // Field Input
  borderDark: "#232D3F", // Subtle Borders

  // Status Colors (LTO Compliance & Parts Health)
  success: "#4CAF50", // Green
  warning: "#FF9800", // Orange
  danger: "#F44336", // Red

  // Text Colors
  textPrimary: "#FFFFFF",
  textSecondary: "#94A3B8",
  textMuted: "#64748B",

  // Light / Dark scheme mappings (used by default Expo template hooks)
  light: {
    text: "#111827",
    background: "#FFFFFF",
    tint: "#FF6600",
    icon: "#6B7280",
    tabIconDefault: "#9CA3AF",
    tabIconSelected: "#FF6600",
  },
  dark: {
    text: "#FFFFFF",
    background: "#0B0F17",
    tint: "#FF6600",
    icon: "#9CA3AF",
    tabIconDefault: "#64748B",
    tabIconSelected: "#FF6600",
  },
};

export const Colors = COLORS;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,

  // Word scale (expected by Expo template components)
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 20,
  six: 24,
  seven: 28,
  eight: 32,
  nine: 36,
  ten: 40,
};

export const Spacing = SPACING;
export const spacing = SPACING;

export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 16,
  full: 9999,

  one: 4,
  two: 8,
  three: 12,
  four: 16,
};

export const Radius = RADIUS;
export const radius = RADIUS;
export const BorderRadius = RADIUS;
export const borderRadius = RADIUS;

export const FONTS = {
  sans: "System",
  serif: "Georgia",
  mono: "PlatformMono",
};

export const Fonts = FONTS;
export const fonts = FONTS;

export default {
  COLORS,
  Colors,
  SPACING,
  Spacing,
  spacing,
  RADIUS,
  Radius,
  radius,
  BorderRadius,
  borderRadius,
  FONTS,
  Fonts,
  fonts,
};
