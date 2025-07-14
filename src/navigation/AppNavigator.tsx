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
import { RootStackParamList, RootTabParamList } from '../types/navigation';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();
const { width: screenWidth } = Dimensions.get('window');

// Responsive font sizes based on screen width
const getResponsiveFontSize = (baseSize: number) => {
  if (screenWidth < 375) return baseSize - 1; 
  if (screenWidth > 414) return baseSize + 1;  
  return baseSize; // Standard screens
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
          fontWeight: Typography.fontWeight.semibold,
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
          headerTitle: 'Discover Breeds'
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

function AppTabNavigator() {
  const insets = useSafeAreaInsets();
  
  // Calculate responsive tab bar height
  const baseTabBarHeight = Platform.OS === 'ios' ? 65 : 60;
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
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    elevation: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingTop: Spacing.xs,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 2,
    paddingHorizontal: 2,
    minWidth: screenWidth < 375 ? 70 : 80, // Ensure minimum width for text
  },
  iconWrapper: {
    width: screenWidth < 375 ? 36 : 40,
    height: screenWidth < 375 ? 36 : 40,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
    backgroundColor: 'transparent',
  },
  iconWrapperFocused: {
    backgroundColor: `${Colors.primary}12`,
  },
  iconText: {
    fontSize: screenWidth < 375 ? 18 : 20,
  },
  iconTextFocused: {
    fontSize: screenWidth < 375 ? 20 : 22,
  },
  tabLabel: {
    fontSize: getResponsiveFontSize(10),
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textTertiary,
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  tabLabelFocused: {
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semibold,
    fontSize: getResponsiveFontSize(11),
  },
});