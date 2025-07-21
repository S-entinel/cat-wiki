import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const BASE_UNIT = 4;

export const Colors = {
  // Black & White Primary Palette
  primary: '#000000',
  primaryLight: '#333333',
  primaryDark: '#000000',
  primarySoft: '#F8F8F8',
  
  // Secondary Palette
  secondary: '#666666',
  secondaryLight: '#999999',
  secondaryDark: '#333333',
  secondarySoft: '#F5F5F5',
  
  // Minimal Accent Colors
  accent: '#000000',
  accentLight: '#333333',
  accentDark: '#000000',
  accentSoft: '#F0F0F0',
  
  // Grayscale colors
  gray100: '#F7F7F7',
  gray200: '#E5E5E5',
  gray300: '#D4D4D4',
  gray400: '#A3A3A3',
  gray500: '#737373',
  gray600: '#525252',
  gray700: '#404040',
  gray800: '#262626',
  gray900: '#171717',
  
  // Surfaces
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceVariant: '#FAFAFA',
  
  // Text colors
  text: '#000000',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textInverse: '#FFFFFF',
  textDisabled: '#CCCCCC',
  
  // Status colors
  success: '#000000',
  successLight: '#333333',
  successDark: '#000000',
  successSoft: '#F8F8F8',
  
  warning: '#000000',
  warningLight: '#333333',
  warningDark: '#000000',
  warningSoft: '#F8F8F8',
  
  error: '#000000',
  errorLight: '#333333',
  errorDark: '#000000',
  errorSoft: '#F8F8F8',
  
  info: '#000000',
  infoLight: '#333333',
  infoDark: '#000000',
  infoSoft: '#F8F8F8',
  
  // Borders and UI
  border: '#E5E5E5',
  borderFocus: '#000000',
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: '#000000',
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