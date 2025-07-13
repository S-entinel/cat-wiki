// src/constants/theme.ts
export const Colors = {
    // Primary Palette - Inspired by elegant cat-like aesthetics
    primary: '#2D1B69',      // Deep purple - main brand color
    primaryLight: '#4A3489',  // Lighter purple
    primaryDark: '#1A0F3D',   // Darker purple
    
    // Secondary Palette
    secondary: '#FF6B9D',     // Pink accent
    secondaryLight: '#FFB3D1', // Light pink
    secondaryDark: '#E5477A',  // Dark pink
    
    // Accent Colors
    accent: '#4ECDC4',        // Teal accent
    accentLight: '#8EEAE5',   // Light teal
    accentDark: '#2B9E96',    // Dark teal
    
    // Neutral Colors
    background: '#F8F9FA',    // Light background
    surface: '#FFFFFF',       // Card surfaces
    surfaceVariant: '#F5F7FA', // Alternate surfaces
    
    // Text Colors
    text: '#1A1A1A',          // Primary text
    textSecondary: '#6B7280', // Secondary text
    textTertiary: '#9CA3AF',  // Tertiary text
    textInverse: '#FFFFFF',   // Text on dark backgrounds
    
    // Status Colors
    success: '#10B981',       // Green
    warning: '#F59E0B',       // Amber
    error: '#EF4444',         // Red
    info: '#3B82F6',          // Blue
    
    // Border Colors
    border: '#E5E7EB',        // Light border
    borderFocus: '#C7D2FE',   // Focus border
    
    // Shadow Colors
    shadow: '#000000',
    
    // Overlay
    overlay: 'rgba(0, 0, 0, 0.5)',
  } as const;
  
  export const Spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  } as const;
  
  export const BorderRadius = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 9999,
  } as const;
  
  export const Typography = {
    // Font Sizes
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 28,
      xxxxl: 32,
    },
    
    // Font Weights
    fontWeight: {
      normal: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
      extrabold: '800' as const,
    },
    
    // Line Heights
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.6,
    },
  } as const;
  
  export const Shadows = {
    sm: {
      shadowColor: Colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: Colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: Colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    xl: {
      shadowColor: Colors.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  } as const;
  
  export const Layout = {
    // Standard padding for screens
    screenPadding: Spacing.lg,
    
    // Card spacing
    cardPadding: Spacing.lg,
    cardMargin: Spacing.md,
    
    // List item spacing
    listItemPadding: Spacing.md,
    listItemMargin: Spacing.sm,
    
    // Header heights
    headerHeight: 56,
    tabBarHeight: 60,
  } as const;
  
  export const Gradients = {
    primary: ['#2D1B69', '#4A3489'],
    secondary: ['#FF6B9D', '#E5477A'],
    accent: ['#4ECDC4', '#2B9E96'],
    surface: ['#FFFFFF', '#F8F9FA'],
  } as const;