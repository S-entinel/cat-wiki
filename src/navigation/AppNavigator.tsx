import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import BreedsScreen from '../screens/BreedsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import BreedDetailScreen from '../screens/BreedDetailScreen';
import { RootStackParamList } from '../types/navigation';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

function BreedsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="BreedsList" 
        component={BreedsScreen}
        options={{ title: 'Cat Breeds' }}
      />
      <Stack.Screen 
        name="BreedDetail" 
        component={BreedDetailScreen}
        options={{ title: 'Breed Details' }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: '🏠 Home' }}
        />
        <Tab.Screen 
          name="Breeds" 
          component={BreedsStack}
          options={{ title: '🐱 Breeds' }}
        />
        <Tab.Screen 
          name="Favorites" 
          component={FavoritesScreen}
          options={{ title: '❤️ Favorites' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}