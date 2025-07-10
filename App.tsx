import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { DatabaseProvider } from './src/context/DatabaseContext';

export default function App() {
  return (
    <DatabaseProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </DatabaseProvider>
  );
}