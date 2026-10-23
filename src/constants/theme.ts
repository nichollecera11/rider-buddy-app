export const COLORS = {
  // Figma Brand Palette
  primary: "#FFD629", // Vibrant Gold / Yellow
  darkBg: "#281137", // Deep Plum / Dark Carbon
  accentPurple: "#4C246B", // Royal Purple Accent
  softPurple: "#F2EAF7", // Light Purple Surface

  // Neutral Surfaces
  bgLight: "#FBFAF8", // Light Cream Background
  bgCanvas: "#ECEAE5", // Canvas Radial
  cardWhite: "#FFFFFF", // Card Surface
  borderLight: "#E9E6EA", // Border Divider

  // Status Tokens
  success: "#20A573", // Online / Health Green
  successBg: "#EDF8F3", // Soft Green Pill
  warning: "#E7AB00", // Star Rating Yellow
  danger: "#F44336", // Emergency Red

  // Text Colors
  textDark: "#18161B", // Dark Body Text
  textMuted: "#77717C", // Muted Gray
  textLight: "#FFFFFF", // Crisp White Text

  // Light / Dark Fallbacks
  light: {
    text: "#18161B",
    background: "#FBFAF8",
    tint: "#4C246B",
    tabIconDefault: "#99949D",
    tabIconSelected: "#4C246B",
  },
  dark: {
    text: "#FFFFFF",
    background: "#281137",
    tint: "#FFD629",
    tabIconDefault: "#77717C",
    tabIconSelected: "#FFD629",
  },
};

export const Colors = COLORS;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,

  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 20,
  six: 24,
  seven: 28,
  eight: 32,
};

export const Spacing = SPACING;
export const spacing = SPACING;

export const RADIUS = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 24,
  full: 9999,

  one: 4,
  two: 8,
  three: 12,
  four: 16,
};

export const Radius = RADIUS;
export const radius = RADIUS;

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
  FONTS,
  Fonts,
  fonts,
};
