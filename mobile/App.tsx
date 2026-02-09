import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppDataProvider } from '@/context/AppDataContext';
import { AuthProvider } from '@/context/AuthContext';
import { AppNavigator } from '@/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <StatusBar style="light" />
        <AppNavigator />
      </AppDataProvider>
    </AuthProvider>
  );
}
