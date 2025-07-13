// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import BreedsScreen from '../screens/BreedsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import BreedDetailScreen from '../screens/BreedDetailScreen';
import { RootStackParamList, RootTabParamList } from '../types/navigation';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

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
    <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
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

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
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
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    height: 80,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
    backgroundColor: 'transparent',
  },
  iconWrapperFocused: {
    backgroundColor: `${Colors.primary}15`,
  },
  iconText: {
    fontSize: Typography.fontSize.xl,
  },
  iconTextFocused: {
    fontSize: Typography.fontSize.xl,
  },
  tabLabel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textTertiary,
  },
  tabLabelFocused: {
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
});