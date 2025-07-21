import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  Dimensions,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

const { width: screenWidth } = Dimensions.get('window');

interface TabItemProps {
  icon: string;
  focused: boolean;
  onPress: () => void;
  index: number;
}

const TabItem: React.FC<TabItemProps> = ({ icon, focused, onPress, index }) => {
  const scaleAnim = useRef(new Animated.Value(focused ? 1 : 0.98)).current;
  const opacityAnim = useRef(new Animated.Value(focused ? 1 : 0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: focused ? 1.05 : 0.98,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: focused ? 1 : 0.5,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused]);

  return (
    <TouchableOpacity
      style={styles.tabItem}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <Animated.View
        style={[
          styles.tabItemContent,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          }
        ]}
      >
        <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
          <Text
            style={[
              styles.iconText,
              focused && styles.iconTextFocused,
            ]}
          >
            {icon}
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const tabBarHeight = Platform.OS === 'ios' ? 85 : 75;

  const backgroundAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(backgroundAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, []);

  const getTabIcon = (routeName: string): string => {
    switch (routeName) {
      case 'Home': return '⌂';
      case 'Breeds': return '◉';
      case 'Quiz': return '◈';
      case 'Favorites': return '♡';
      default: return '○';
    }
  };

  return (
    <View style={[
      styles.container,
      {
        height: tabBarHeight + insets.bottom,
        paddingBottom: insets.bottom,
      }
    ]}>
      {/* Professional background */}
      <View style={styles.tabBarBackground} />
      
      <View style={styles.tabsContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <TabItem
              key={route.key}
              icon={getTabIcon(route.name)}
              focused={isFocused}
              onPress={onPress}
              index={index}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },

  tabBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },

  tabsContainer: {
    flexDirection: 'row',
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xs,
  },

  tabItemContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  iconContainerFocused: {
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.lg,
  },

  iconText: {
    fontSize: 20,
    textAlign: 'center',
    color: Colors.textTertiary,
    fontWeight: Typography.fontWeight.normal,
  },

  iconTextFocused: {
    color: Colors.text,
    fontWeight: Typography.fontWeight.medium,
  },
});