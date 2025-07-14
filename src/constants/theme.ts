
import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const BASE_UNIT = 4;

export const Colors = {
  // Primary Palette
  primary: '#5B47FF',
  primaryLight: '#7B69FF',
  primaryDark: '#3D29CC',
  primarySoft: '#F0EDFF',
  
  // Secondary Palette
  secondary: '#FF6B9D',
  secondaryLight: '#FFB3D1',
  secondaryDark: '#E5477A',
  secondarySoft: '#FFF0F5',
  
  // Accent Colors
  accent: '#00D4AA',
  accentLight: '#33E0BB',
  accentDark: '#00B894',
  accentSoft: '#E6FFF9',
  
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceVariant: '#F8FAFC',
  
  // Text Colors
  text: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#94A3B8',
  textInverse: '#FFFFFF',
  textDisabled: '#CBD5E1',
  
  // Status Colors
  success: '#059669',
  successLight: '#34D399',
  successDark: '#047857',
  successSoft: '#ECFDF5',
  
  warning: '#D97706',
  warningLight: '#FBBF24',
  warningDark: '#B45309',
  warningSoft: '#FFFBEB',
  
  error: '#DC2626',
  errorLight: '#F87171',
  errorDark: '#B91C1C',
  errorSoft: '#FEF2F2',
  
  info: '#2563EB',
  infoLight: '#60A5FA',
  infoDark: '#1D4ED8',
  infoSoft: '#EFF6FF',
  
  // Border and UI
  border: '#E2E8F0',
  borderFocus: '#93C5FD',
  overlay: 'rgba(15, 23, 42, 0.8)',
  shadow: '#0F172A',
} as const;

export const Spacing = {
  // Base spacing scale
  xs: BASE_UNIT,       // 4px
  sm: BASE_UNIT * 2,   // 8px
  md: BASE_UNIT * 3,   // 12px
  lg: BASE_UNIT * 4,   // 16px
  xl: BASE_UNIT * 5,   // 20px
  xxl: BASE_UNIT * 6,  // 24px
  xxxl: BASE_UNIT * 8, // 32px
} as const;

export const BorderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  xxl: 16,
  xxxl: 24,
  full: 9999,
} as const;

export const Typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
    xxxxl: 36,
    xxxxxl: 48,
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
    tight: 1.25,
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  xl: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 12,
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
  
  // Legacy support
  screenPadding: Spacing.lg,
  cardPadding: Spacing.lg,
  cardMargin: Spacing.md,
  listItemPadding: Spacing.md,
  listItemMargin: Spacing.sm,
  headerHeight: 56,
  tabBarHeight: 60,
} as const;

// Helper functions
export const responsive = {
  isTablet: () => screenWidth >= 768,
  getValue: <T>(mobile: T, tablet?: T): T => {
    return responsive.isTablet() && tablet !== undefined ? tablet : mobile;
  },
  fontSize: (base: number, scale: number = 0.1): number => {
    return responsive.isTablet() ? base + (base * scale) : base;
  },
} as const;