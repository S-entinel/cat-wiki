import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors, BorderRadius, Spacing, Typography, Shadows } from '../../constants/theme';

interface BadgeProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
  outlined?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ 
  text, 
  variant = 'primary',
  size = 'md',
  style,
  textStyle,
  outlined = false,
}) => {
  const badgeStyle = [
    styles.badge,
    outlined ? styles[`${variant}Outlined`] : styles[variant],
    styles[size],
    style,
  ];

  const textStyleCombined = [
    styles.text,
    styles[`${size}Text`],
    outlined ? styles[`${variant}OutlinedText`] : styles[`${variant}Text`],
    textStyle,
  ];

  return (
    <View style={badgeStyle}>
      <Text style={textStyleCombined} numberOfLines={1}>
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
    alignSelf: 'flex-start',
    ...Shadows.xs,
  },
  
  xs: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    minHeight: 18,
  },
  sm: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    minHeight: 22,
  },
  md: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    minHeight: 28,
  },
  lg: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    minHeight: 36,
  },
  
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
  info: {
    backgroundColor: Colors.info,
  },
  neutral: {
    backgroundColor: Colors.textSecondary,
  },
  
  primaryOutlined: {
    backgroundColor: Colors.primarySoft,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  secondaryOutlined: {
    backgroundColor: Colors.secondarySoft,
    borderWidth: 1.5,
    borderColor: Colors.secondary,
  },
  accentOutlined: {
    backgroundColor: Colors.accentSoft,
    borderWidth: 1.5,
    borderColor: Colors.accent,
  },
  successOutlined: {
    backgroundColor: Colors.successSoft,
    borderWidth: 1.5,
    borderColor: Colors.success,
  },
  warningOutlined: {
    backgroundColor: Colors.warningSoft,
    borderWidth: 1.5,
    borderColor: Colors.warning,
  },
  errorOutlined: {
    backgroundColor: Colors.errorSoft,
    borderWidth: 1.5,
    borderColor: Colors.error,
  },
  infoOutlined: {
    backgroundColor: Colors.infoSoft,
    borderWidth: 1.5,
    borderColor: Colors.info,
  },
  neutralOutlined: {
    backgroundColor: Colors.surfaceVariant,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  
  text: {
    fontWeight: Typography.fontWeight.bold,
    textAlign: 'center',
  },
  
  xsText: {
    fontSize: Typography.fontSize.xs,
    lineHeight: Typography.fontSize.xs * 1.2,
  },
  smText: {
    fontSize: Typography.fontSize.xs,
    lineHeight: Typography.fontSize.xs * 1.3,
  },
  mdText: {
    fontSize: Typography.fontSize.sm,
    lineHeight: Typography.fontSize.sm * 1.2,
  },
  lgText: {
    fontSize: Typography.fontSize.base,
    lineHeight: Typography.fontSize.base * 1.2,
  },
  
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
  infoText: {
    color: Colors.textInverse,
  },
  neutralText: {
    color: Colors.textInverse,
  },
  
  primaryOutlinedText: {
    color: Colors.primary,
  },
  secondaryOutlinedText: {
    color: Colors.secondary,
  },
  accentOutlinedText: {
    color: Colors.accent,
  },
  successOutlinedText: {
    color: Colors.success,
  },
  warningOutlinedText: {
    color: Colors.warning,
  },
  errorOutlinedText: {
    color: Colors.error,
  },
  infoOutlinedText: {
    color: Colors.info,
  },
  neutralOutlinedText: {
    color: Colors.textSecondary,
  },
});