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
      padding="md"
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
        <Text style={styles.featureTitle} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.featureDescription} numberOfLines={2}>
          {description}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  
  elevated: {
    backgroundColor: Colors.surface,
  },
  outlined: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  filled: {
    backgroundColor: Colors.surfaceVariant,
  },
  surface: {
    backgroundColor: Colors.surfaceVariant,
  },
  
  padding_sm: { padding: Spacing.sm },
  padding_md: { padding: Spacing.md },
  padding_lg: { padding: Spacing.lg },
  padding_xl: { padding: Spacing.xl },
  
  margin_sm: { margin: Spacing.sm },
  margin_md: { margin: Spacing.md },
  margin_lg: { margin: Spacing.lg },
  
  radius_none: { borderRadius: BorderRadius.none },
  radius_sm: { borderRadius: BorderRadius.sm },
  radius_md: { borderRadius: BorderRadius.md },
  radius_lg: { borderRadius: BorderRadius.lg },
  radius_xl: { borderRadius: BorderRadius.xl },
  radius_xxl: { borderRadius: BorderRadius.xxl },
  
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
  
  featureCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.xl,
    minHeight: 100,
  },
  
  featureIconContainer: {
    marginBottom: Spacing.sm,
    alignItems: 'center',
  },
  
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.xs,
  },
  
  feature_primary: {},
  feature_secondary: {},
  feature_accent: {},
  feature_neutral: {},
  
  featureIcon_primary: {
    backgroundColor: Colors.mintSoft,
  },
  featureIcon_secondary: {
    backgroundColor: Colors.coralSoft,
  },
  featureIcon_accent: {
    backgroundColor: Colors.skySoft,
  },
  featureIcon_neutral: {
    backgroundColor: Colors.lemonSoft,
  },
  
  featureContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  
  featureTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
    textAlign: 'center',
    lineHeight: Typography.fontSize.sm * 1.2,
  },
  
  featureDescription: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.fontSize.xs * 1.3,
    fontWeight: Typography.fontWeight.medium,
  },
});