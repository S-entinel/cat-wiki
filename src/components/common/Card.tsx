import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Shadows, BorderRadius, Spacing } from '../../constants/theme';


interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: keyof typeof Spacing;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  style, 
  variant = 'default',
  padding = 'lg'
}) => {
  const getCardStyle = () => {
    switch (variant) {
      case 'elevated':
        return [styles.card, styles.elevated, { padding: Spacing[padding] }, style];
      case 'outlined':
        return [styles.card, styles.outlined, { padding: Spacing[padding] }, style];
      default:
        return [styles.card, styles.default, { padding: Spacing[padding] }, style];
    }
  };

  return (
    <View style={getCardStyle()}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
  },
  default: {
    backgroundColor: Colors.surface,
    ...Shadows.md,
  },
  elevated: {
    backgroundColor: Colors.surface,
    ...Shadows.lg,
  },
  outlined: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
});