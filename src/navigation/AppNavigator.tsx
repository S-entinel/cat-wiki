import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

const getResponsiveFontSize = (baseSize: number) => {
  if (screenWidth < 375) return baseSize - 1;
  if (screenWidth > 414) return baseSize + 1;
  return baseSize;
};

interface TabIconProps {
  icon: string;
  label: string;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ icon, label, focused }) => (
  <View style={styles.tabIconContainer}>
    <View style={[styles.iconWrapper, focused && styles.iconWrapperFocused]}>
      <Text style={[styles.iconText, focused && styles.iconTextFocused]}>
        {icon}
      </Text>
      {focused && <View style={styles.focusIndicator} />}
    </View>
    <Text 
      style={[styles.tabLabel, focused && styles.tabLabelFocused]} 
      numberOfLines={1}
      adjustsFontSizeToFit
      minimumFontScale={0.8}
    >
      {label}
    </Text>
  </View>
);

function BreedsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.surface,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border,
        },
        headerTitleStyle: {
          fontSize: Typography.fontSize.lg,
          fontWeight: Typography.fontWeight.bold,
          color: Colors.text,
        },
        headerTintColor: Colors.primary
      }}
    >
      <Stack.Screen 
        name="BreedsList" 
        component={BreedsScreen}
        options={{ 
          title: 'Cat Breeds',
          headerTitle: 'Breed Collection'
        }}
      />
      <Stack.Screen 
        name="BreedDetail" 
        component={BreedDetailScreen}
        options={{ 
          title: 'Breed Details',
          headerTitle: 'Breed Information'
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
  
  const baseTabBarHeight = Platform.OS === 'ios' ? 70 : 65;
  const tabBarHeight = baseTabBarHeight + (screenWidth < 375 ? -5 : screenWidth > 414 ? 5 : 0);
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          ...styles.tabBar,
          height: tabBarHeight + insets.bottom,
          paddingBottom: insets.bottom,
          paddingHorizontal: screenWidth < 375 ? Spacing.xs : Spacing.sm,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textTertiary,
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
    borderTopWidth: 2,
    borderTopColor: Colors.border,
    elevation: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    paddingTop: Spacing.sm,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 1,
    minWidth: screenWidth < 375 ? 60 : 70,
  },
  iconWrapper: {
    width: screenWidth < 375 ? 36 : 40,
    height: screenWidth < 375 ? 36 : 40,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  iconWrapperFocused: {
    backgroundColor: Colors.primarySoft,
    ...Shadows.xs,
  },
  focusIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
  },
  iconText: {
    fontSize: screenWidth < 375 ? 18 : 20,
  },
  iconTextFocused: {
    fontSize: screenWidth < 375 ? 20 : 22,
  },
  tabLabel: {
    fontSize: getResponsiveFontSize(9),
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textTertiary,
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  tabLabelFocused: {
    color: Colors.primary,
    fontWeight: Typography.fontWeight.black,
    fontSize: getResponsiveFontSize(10),
  },
});