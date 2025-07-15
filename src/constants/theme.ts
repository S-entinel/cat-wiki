import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const BASE_UNIT = 4;

export const Colors = {
  // Multi-pastel Primary Palette
  primary: '#A8E6CF',
  primaryLight: '#C8F2E0',
  primaryDark: '#88D8A3',
  primarySoft: '#F0FBF4',
  
  // Pastel Secondary Palette
  secondary: '#FFD3A5',
  secondaryLight: '#FFE1C1',
  secondaryDark: '#FFC78A',
  secondarySoft: '#FFF8F0',
  
  // Pastel Accent Colors
  accent: '#A8C8EC',
  accentLight: '#C1D9F0',
  accentDark: '#8FB6E8',
  accentSoft: '#F0F6FC',
  
  // Additional pastel colors
  lavender: '#D4A5FF',
  lavenderSoft: '#F4F0FF',
  
  coral: '#FFB3BA',
  coralSoft: '#FFF0F2',
  
  mint: '#B3FFD9',
  mintSoft: '#F0FFFA',
  
  lemon: '#FFFACD',
  lemonSoft: '#FFFEF5',
  
  sky: '#87CEEB',
  skySoft: '#F0F8FF',
  
  rose: '#FFC0CB',
  roseSoft: '#FFF5F7',
  
  // Neutral pastels
  background: '#FDFCFF',
  surface: '#FFFFFF',
  surfaceElevated: '#FEFEFF',
  surfaceVariant: '#F5F3F7',
  
  // Soft text colors
  text: '#4A3C5A',
  textSecondary: '#6B5B7A',
  textTertiary: '#9B8CAB',
  textInverse: '#FFFFFF',
  textDisabled: '#C4B8D1',
  
  // Pastel status colors
  success: '#B3E5B3',
  successLight: '#D1F2D1',
  successDark: '#99DD99',
  successSoft: '#F5FDF5',
  
  warning: '#FFE4B3',
  warningLight: '#FFF0D1',
  warningDark: '#FFD799',
  warningSoft: '#FFFCF5',
  
  error: '#FFB3B3',
  errorLight: '#FFD1D1',
  errorDark: '#FF9999',
  errorSoft: '#FFF5F5',
  
  info: '#B3D9FF',
  infoLight: '#D1E7FF',
  infoDark: '#99CCFF',
  infoSoft: '#F0F8FF',
  
  // Soft borders and UI
  border: '#E8E0ED',
  borderFocus: '#D4A5FF',
  overlay: 'rgba(74, 60, 90, 0.6)',
  shadow: '#4A3C5A',
} as const;

export const Spacing = {
  xs: BASE_UNIT,
  sm: BASE_UNIT * 2,
  md: BASE_UNIT * 3,
  lg: BASE_UNIT * 4,
  xl: BASE_UNIT * 5,
  xxl: BASE_UNIT * 6,
  xxxl: BASE_UNIT * 8,
} as const;

export const BorderRadius = {
  none: 0,
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 36,
  full: 9999,
} as const;

export const Typography = {
  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    lg: 17,
    xl: 19,
    xxl: 23,
    xxxl: 28,
    xxxxl: 34,
    xxxxxl: 44,
  },
  
  fontWeight: {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
    black: '900' as const,
  },
  
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
} as const;

export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sm: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  md: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 6,
  },
  lg: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.20,
    shadowRadius: 20,
    elevation: 10,
  },
  xl: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.24,
    shadowRadius: 32,
    elevation: 16,
  },
} as const;

export const Layout = {
  screen: {
    width: screenWidth,
    height: screenHeight,
  },
  
  header: {
    height: 56,
    heightLarge: 64,
  },
  
  tabBar: {
    height: 60,
    heightSafe: 83,
  },
  
  touchTarget: {
    min: 44,
    comfortable: 48,
  },
  
  content: {
    padding: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  
  card: {
    minHeight: 120,
    padding: Spacing.lg,
    margin: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  
  screenPadding: Spacing.lg,
  cardPadding: Spacing.lg,
  cardMargin: Spacing.md,
  listItemPadding: Spacing.md,
  listItemMargin: Spacing.sm,
  headerHeight: 56,
  tabBarHeight: 60,
} as const;

export const responsive = {
  isTablet: () => screenWidth >= 768,
  getValue: <T>(mobile: T, tablet?: T): T => {
    return responsive.isTablet() && tablet !== undefined ? tablet : mobile;
  },
  fontSize: (base: number, scale: number = 0.1): number => {
    return responsive.isTablet() ? base + (base * scale) : base;
  },
} as const;