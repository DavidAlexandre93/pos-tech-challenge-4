import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '@/hooks/useAuth';
import { LoginScreen } from '@/screens/LoginScreen';
import { AppTabs } from '@/navigation/AppTabs';
import { ROOT_ROUTES, resolveRootRoute } from '@/navigation/accessControl';

export type RootStackParamList = {
  Login: undefined;
  App: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const initialRoute = resolveRootRoute(false, Boolean(user));

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {initialRoute === ROOT_ROUTES.app ? (
          <Stack.Screen name={ROOT_ROUTES.app} component={AppTabs} />
        ) : (
          <Stack.Screen name={ROOT_ROUTES.login} component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
