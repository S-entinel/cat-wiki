import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { DatabaseProvider } from './src/context/DatabaseContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <DatabaseProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </DatabaseProvider>
    </SafeAreaProvider>
  );
}