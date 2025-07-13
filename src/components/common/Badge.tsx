import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors, BorderRadius, Spacing, Typography } from '../../constants/theme';

interface BadgeProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({ 
  text, 
  variant = 'primary',
  size = 'md',
  style,
  textStyle
}) => {
  return (
    <View style={[styles.badge, styles[variant], styles[size], style]}>
      <Text style={[styles.text, styles[`${size}Text`], styles[`${variant}Text`], textStyle]}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.full,
  },
  
  // Variants
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.secondary,
  },
  accent: {
    backgroundColor: Colors.accent,
  },
  success: {
    backgroundColor: Colors.success,
  },
  warning: {
    backgroundColor: Colors.warning,
  },
  error: {
    backgroundColor: Colors.error,
  },
  
  // Sizes
  sm: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  md: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  lg: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  
  // Text styles
  text: {
    color: Colors.textInverse,
    fontWeight: Typography.fontWeight.medium,
  },
  smText: {
    fontSize: Typography.fontSize.xs,
  },
  mdText: {
    fontSize: Typography.fontSize.sm,
  },
  lgText: {
    fontSize: Typography.fontSize.base,
  },
  
  // Text variant colors
  primaryText: {
    color: Colors.textInverse,
  },
  secondaryText: {
    color: Colors.textInverse,
  },
  accentText: {
    color: Colors.text,
  },
  successText: {
    color: Colors.textInverse,
  },
  warningText: {
    color: Colors.text,
  },
  errorText: {
    color: Colors.textInverse,
  },
});