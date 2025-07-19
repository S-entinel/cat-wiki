import React, { useRef, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, Platform, Dimensions, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import HomeScreen from '../screens/HomeScreen';
import BreedsScreen from '../screens/BreedsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import BreedDetailScreen from '../screens/BreedDetailScreen';
import PersonalityQuizScreen from '../screens/PersonalityQuizScreen';
import QuizResultsScreen from '../screens/QuizResultsScreen';
import { RootStackParamList, RootTabParamList } from '../types/navigation';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();
const { width: screenWidth } = Dimensions.get('window');

interface TabIconProps {
  icon: string;
  label: string;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ icon, label, focused }) => {
  const scaleAnim = useRef(new Animated.Value(focused ? 1 : 0.9)).current;
  const fadeAnim = useRef(new Animated.Value(focused ? 1 : 0.7)).current;
  const slideAnim = useRef(new Animated.Value(focused ? 0 : 2)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: focused ? 1 : 0.9,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: focused ? 1 : 0.7,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: focused ? 0 : 2,
        tension: 200,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused]);

  return (
    <View style={styles.tabIconContainer}>
      <Animated.View 
        style={[
          styles.iconWrapper, 
          focused && styles.iconWrapperFocused,
          {
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        {focused && (
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={styles.iconGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        )}
        <Animated.Text 
          style={[
            styles.iconText, 
            focused && styles.iconTextFocused,
            {
              opacity: fadeAnim,
            }
          ]}
        >
          {icon}
        </Animated.Text>
        
        {focused && (
          <Animated.View 
            style={[
              styles.focusIndicator,
              {
                transform: [{ translateY: slideAnim }]
              }
            ]} 
          />
        )}
      </Animated.View>
    </View>
  );
};

function BreedsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen 
        name="BreedsList" 
        component={BreedsScreen}
      />
      <Stack.Screen 
        name="BreedDetail" 
        component={BreedDetailScreen}
        options={{
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />
    </Stack.Navigator>
  );
}

function QuizStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen 
        name="PersonalityQuiz" 
        component={PersonalityQuizScreen}
      />
      <Stack.Screen 
        name="QuizResults" 
        component={QuizResultsScreen}
        options={{
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />
    </Stack.Navigator>
  );
}

function AppTabNavigator() {
  const insets = useSafeAreaInsets();
  
  const tabBarHeight = Platform.OS === 'ios' ? 75 : 65;
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          ...styles.tabBar,
          height: tabBarHeight + insets.bottom,
          paddingBottom: insets.bottom + (Platform.OS === 'ios' ? 8 : 12),
          paddingTop: Platform.OS === 'ios' ? 12 : 10,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="Home" label="Home" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Breeds"
        component={BreedsStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="Cats" label="Breeds" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Quiz"
        component={QuizStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="Quiz" label="Quiz" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="♥" label="Favorites" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <AppTabNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 0,
    ...Shadows.xl,
    elevation: 24,
    borderTopLeftRadius: BorderRadius.xxxl,
    borderTopRightRadius: BorderRadius.xxxl,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    // Add subtle border for definition
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderBottomWidth: 0,
  },
  
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    minHeight: 55,
    flex: 1,
  },
  
  iconWrapper: {
    width: 54,
    height: 54,
    borderRadius: BorderRadius.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    position: 'relative',
    overflow: 'hidden',
  },
  iconWrapperFocused: {
    ...Shadows.lg,
    elevation: 8,
  },
  
  iconGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: BorderRadius.xxxl,
  },
  
  iconText: {
    fontSize: 16,
    fontWeight: Typography.fontWeight.bold,
    textAlign: 'center',
    zIndex: 1,
    color: Colors.textSecondary,
  },
  iconTextFocused: {
    fontSize: 16,
    color: Colors.textInverse,
  },
  
  focusIndicator: {
    position: 'absolute',
    bottom: -10,
    width: 28,
    height: 4,
                backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    ...Shadows.md,
  },
  
  tabLabel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: 2,
  },
  tabLabelFocused: {
    color: Colors.primary,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.xs + 1,
  },
});