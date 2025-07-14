// src/components/common/Card.tsx
import React from 'react';
import { 
  View, 
  Text,
  ViewStyle, 
  StyleSheet, 
  TouchableOpacity,
  TouchableOpacityProps 
} from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows, Typography } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled' | 'surface';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  margin?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  fullWidth?: boolean;
  style?: ViewStyle;
  pressable?: boolean;
  onPress?: () => void;
  disabled?: boolean;
}

export const Card: React.FC<CardProps & TouchableOpacityProps> = ({
  children,
  variant = 'elevated',
  padding = 'lg',
  margin = 'none',
  shadow = 'sm',
  borderRadius = 'lg',
  fullWidth = true,
  style,
  pressable = false,
  onPress,
  disabled = false,
  ...touchableProps
}) => {
  const cardStyles = [
    styles.base,
    styles[variant],
    padding !== 'none' && styles[`padding_${padding}`],
    margin !== 'none' && styles[`margin_${margin}`],
    shadow !== 'none' && Shadows[shadow],
    styles[`radius_${borderRadius}`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ].filter(Boolean);

  if (pressable || onPress) {
    return (
      <TouchableOpacity
        style={cardStyles}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.95}
        {...touchableProps}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyles}>
      {children}
    </View>
  );
};

// Feature Card component with improved layout
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'neutral';
  style?: ViewStyle;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  onPress,
  variant = 'neutral',
  style,
}) => {
  return (
    <Card
      variant="elevated"
      padding="lg"
      margin="none"
      shadow="sm"
      pressable={!!onPress}
      onPress={onPress}
      style={{
        ...styles.featureCard,      
        ...styles[`feature_${variant}`],     
        ...style     
        }}
    >
      <View style={styles.featureIconContainer}>
        <View style={[styles.featureIcon, styles[`featureIcon_${variant}`]]}>
          {icon}
        </View>
      </View>
      
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.featureDescription} numberOfLines={3}>
          {description}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  // Base card styles
  base: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  
  // Variants
  elevated: {
    backgroundColor: Colors.surface,
  },
  outlined: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filled: {
    backgroundColor: Colors.surfaceVariant,
  },
  surface: {
    backgroundColor: Colors.surfaceVariant,
  },
  
  // Padding variants
  padding_sm: { padding: Spacing.sm },
  padding_md: { padding: Spacing.md },
  padding_lg: { padding: Spacing.lg },
  padding_xl: { padding: Spacing.xl },
  
  // Margin variants
  margin_sm: { margin: Spacing.sm },
  margin_md: { margin: Spacing.md },
  margin_lg: { margin: Spacing.lg },
  
  // Border radius variants
  radius_none: { borderRadius: BorderRadius.none },
  radius_sm: { borderRadius: BorderRadius.sm },
  radius_md: { borderRadius: BorderRadius.md },
  radius_lg: { borderRadius: BorderRadius.lg },
  radius_xl: { borderRadius: BorderRadius.xl },
  radius_xxl: { borderRadius: BorderRadius.xxl },
  
  // States
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
  
  // Feature Card Styles
  featureCard: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 160,
    maxHeight: 200,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  
  featureIconContainer: {
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  feature_primary: {},
  feature_secondary: {},
  feature_accent: {},
  feature_neutral: {},
  
  featureIcon_primary: {
    backgroundColor: Colors.primarySoft,
  },
  featureIcon_secondary: {
    backgroundColor: Colors.secondarySoft,
  },
  featureIcon_accent: {
    backgroundColor: Colors.accentSoft,
  },
  featureIcon_neutral: {
    backgroundColor: Colors.surfaceVariant,
  },
  
  featureContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  
  featureTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
    textAlign: 'center',
    lineHeight: Typography.fontSize.base * 1.2,
  },
  
  featureDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.fontSize.sm * 1.3,
    flex: 1,
  },
});