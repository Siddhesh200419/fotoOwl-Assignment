import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import SplashScreen from '../screens/SplashScreen';
import ImageDetailsScreen from '../screens/home/ImageDetailsScreen';
import { useAuthStore } from '../store/authStore';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { isLoggedIn, hasHydrated } = useAuthStore();

  if (!hasHydrated) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <Stack.Screen name="AuthStack" component={AuthStack} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen
              name="ImageDetails"
              component={ImageDetailsScreen}
              options={{ headerShown: false, animation: 'slide_from_right' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
