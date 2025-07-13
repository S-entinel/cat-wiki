// src/components/AnimatedHeart.tsx
import React, { useRef, useEffect } from 'react';
import { Animated, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

interface AnimatedHeartProps {
  isFavorite: boolean;
  onPress: (event?: any) => void;
  style?: ViewStyle;
  size?: 'sm' | 'md' | 'lg';
  showBackground?: boolean;
}

export const AnimatedHeart: React.FC<AnimatedHeartProps> = ({
  isFavorite,
  onPress,
  style,
  size = 'md',
  showBackground = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Trigger animation when favorite status changes
  useEffect(() => {
    if (isFavorite) {
      // Heart bounce and pulse animation when favorited
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.4,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 0.8,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.spring(bounceAnim, {
            toValue: 1,
            tension: 200,
            friction: 4,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Reset rotation
        rotateAnim.setValue(0);
        
        // Start continuous pulse if favorited
        if (isFavorite) {
          startPulseAnimation();
        }
      });
    } else {
      // Stop pulse animation when unfavorited
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [isFavorite]);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handlePress = (event?: any) => {
    // Press animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    onPress(event);
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          container: styles.containerSm,
          heart: styles.heartSm,
        };
      case 'lg':
        return {
          container: styles.containerLg,
          heart: styles.heartLg,
        };
      default:
        return {
          container: styles.containerMd,
          heart: styles.heartMd,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  
  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '12deg'],
  });

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        sizeStyles.container,
        showBackground && styles.backgroundContainer,
        style
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Animated.Text 
        style={[
          styles.heart,
          sizeStyles.heart,
          {
            transform: [
              { scale: Animated.multiply(scaleAnim, Animated.multiply(bounceAnim, pulseAnim)) },
              { rotate: rotation }
            ]
          }
        ]}
      >
        {isFavorite ? '❤️' : '🤍'}
      </Animated.Text>
      
      {/* Subtle glow effect for favorited hearts */}
      {isFavorite && (
        <Animated.View 
          style={[
            styles.glowEffect,
            {
              opacity: pulseAnim.interpolate({
                inputRange: [1, 1.1],
                outputRange: [0.3, 0.6],
              }),
            }
          ]}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backgroundContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.full,
    ...Shadows.sm,
  },
  
  // Size variants
  containerSm: {
    width: 32,
    height: 32,
  },
  containerMd: {
    width: 44,
    height: 44,
  },
  containerLg: {
    width: 56,
    height: 56,
  },
  
  heart: {
    textAlign: 'center',
  },
  heartSm: {
    fontSize: 18,
  },
  heartMd: {
    fontSize: 24,
  },
  heartLg: {
    fontSize: 32,
  },
  
  glowEffect: {
    position: 'absolute',
    width: '120%',
    height: '120%',
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.error,
    opacity: 0.3,
    zIndex: -1,
  },
});