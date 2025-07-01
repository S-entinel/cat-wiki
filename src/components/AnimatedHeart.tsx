import React, { useRef, useEffect } from 'react';
import { Animated, TouchableOpacity, StyleSheet } from 'react-native';

interface AnimatedHeartProps {
  isFavorite: boolean;
  onPress: () => void;
  style?: any;
}

export const AnimatedHeart: React.FC<AnimatedHeartProps> = ({
  isFavorite,
  onPress,
  style
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;

  // Trigger animation when favorite status changes
  useEffect(() => {
    if (isFavorite) {
      // Heart bounce animation when favorited
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      // Additional bounce effect
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
      ]).start();
    }
  }, [isFavorite]);

  const handlePress = () => {
    // Press animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  return (
    <TouchableOpacity 
      style={[styles.container, style]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Animated.Text 
        style={[
          styles.heart,
          {
            transform: [
              { scale: Animated.multiply(scaleAnim, bounceAnim) }
            ]
          }
        ]}
      >
        {isFavorite ? '❤️' : '🤍'}
      </Animated.Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    marginLeft: 8,
  },
  heart: {
    fontSize: 24,
  },
});