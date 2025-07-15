import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';
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

const TabIcon: React.FC<TabIconProps> = ({ icon, label, focused }) => (
  <View style={styles.tabIconContainer}>
    <View style={[styles.iconWrapper, focused && styles.iconWrapperFocused]}>
      {focused && (
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          style={styles.iconGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      )}
      <Text style={[styles.iconText, focused && styles.iconTextFocused]}>
        {icon}
      </Text>
      {focused && <View style={styles.focusIndicator} />}
    </View>
    <Text 
      style={[styles.tabLabel, focused && styles.tabLabelFocused]} 
      numberOfLines={1}
    >
      {label}
    </Text>
  </View>
);

function BreedsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, 
      }}
    >
      <Stack.Screen 
        name="BreedsList" 
        component={BreedsScreen}
      />
      <Stack.Screen 
        name="BreedDetail" 
        component={BreedDetailScreen}
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
      />
    </Stack.Navigator>
  );
}

function AppTabNavigator() {
  const insets = useSafeAreaInsets();
  
  const tabBarHeight = Platform.OS === 'ios' ? 85 : 70;
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          ...styles.tabBar,
          height: tabBarHeight + insets.bottom,
          paddingBottom: insets.bottom + (Platform.OS === 'ios' ? 5 : 10),
          paddingTop: Platform.OS === 'ios' ? 10 : 8,
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
            <TabIcon icon="🏠" label="Home" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Breeds"
        component={BreedsStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🐱" label="Breeds" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Quiz"
        component={QuizStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🧠" label="Quiz" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="❤️" label="Favorites" focused={focused} />
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
    elevation: 20,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xs,
    minHeight: 60,
    flex: 1,
  },
  
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
    position: 'relative',
    overflow: 'hidden',
  },
  iconWrapperFocused: {
    ...Shadows.lg,
    transform: [{ scale: 1.1 }],
  },
  
  iconGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: BorderRadius.xxl,
  },
  
  iconText: {
    fontSize: 22,
    textAlign: 'center',
    zIndex: 1,
  },
  iconTextFocused: {
    fontSize: 24,
  },
  
  focusIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 24,
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