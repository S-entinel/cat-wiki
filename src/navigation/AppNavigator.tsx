import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Dimensions } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import BreedsScreen from '../screens/BreedsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import BreedDetailScreen from '../screens/BreedDetailScreen';
import PersonalityQuizScreen from '../screens/PersonalityQuizScreen';
import QuizResultsScreen from '../screens/QuizResultsScreen';
import { CustomTabBar } from '../components/navigation/CustomTabBar';
import { RootStackParamList, RootTabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();
// Navigation component for the Cat Breed Encyclopedia app

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
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />
      <Tab.Screen
        name="Breeds"
        component={BreedsStack}
      />
      <Tab.Screen
        name="Quiz"
        component={QuizStack}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
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

const styles = StyleSheet.create({});