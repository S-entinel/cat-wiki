import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  View,
  StyleSheet, 
  ViewStyle, 
  TextStyle, 
  ActivityIndicator,
  GestureResponderEvent,
  Platform 
} from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  accessibilityLabel?: string;
  testID?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
  accessibilityLabel,
  testID,
}) => {
  const isDisabled = disabled || loading;

  const handlePress = (event: GestureResponderEvent) => {
    if (!isDisabled && onPress) {
      onPress(event);
    }
  };

  const getLoadingColor = (variant: string): string => {
    switch (variant) {
      case 'outline':
      case 'ghost':
        return Colors.primary;
      case 'danger':
        return Colors.textInverse;
      default:
        return Colors.textInverse;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.8}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      testID={testID}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator 
            size="small" 
            color={getLoadingColor(variant)}
            style={styles.loadingIndicator}
          />
        ) : (
          <>
            {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
            <Text style={[
              styles.text, 
              styles[`${variant}Text`], 
              styles[`${size}Text`], 
              textStyle
            ]} numberOfLines={1}>
              {title}
            </Text>
            {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.xl,
    flexDirection: 'row',
    overflow: 'hidden',
    minHeight: Platform.OS === 'ios' ? 48 : 44,
    ...Shadows.sm,
  },
  
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: Colors.error,
  },
  
  sm: {
    height: 40,
    paddingHorizontal: Spacing.lg,
    minHeight: 40,
  },
  md: {
    height: 48,
    paddingHorizontal: Spacing.xl,
    minHeight: 48,
  },
  lg: {
    height: 56,
    paddingHorizontal: Spacing.xxl,
    minHeight: 56,
  },
  
  text: {
    fontWeight: Typography.fontWeight.bold,
    textAlign: 'center',
    flexShrink: 1,
  },
  
  primaryText: {
    color: Colors.textInverse,
  },
  secondaryText: {
    color: Colors.textInverse,
  },
  outlineText: {
    color: Colors.primary,
  },
  ghostText: {
    color: Colors.primary,
  },
  dangerText: {
    color: Colors.textInverse,
  },
  
  smText: {
    fontSize: Typography.fontSize.sm,
    lineHeight: Typography.fontSize.sm * 1.2,
  },
  mdText: {
    fontSize: Typography.fontSize.base,
    lineHeight: Typography.fontSize.base * 1.2,
  },
  lgText: {
    fontSize: Typography.fontSize.lg,
    lineHeight: Typography.fontSize.lg * 1.2,
  },
  
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
  
  leftIcon: {
    marginRight: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightIcon: {
    marginLeft: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  loadingIndicator: {
    // Loading indicator spacing is handled automatically
  },
});