import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from './src/store/authStore';
import { useOfflineStore } from './src/store/offlineStore';
import { SyncService } from './src/offline/syncService';
import { View, ActivityIndicator } from 'react-native';

// Placeholder screens
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import RouteDetailScreen from './src/screens/RouteDetailScreen';
import StopDetailScreen from './src/screens/StopDetailScreen';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

export default function App() {
  const { workerId, hydrated: authHydrated } = useAuthStore();
  const { hydrated: offlineHydrated } = useOfflineStore();

  useEffect(() => {
    // Initialize offline sync service
    SyncService.init();
  }, []);

  if (!authHydrated || !offlineHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#101A30' }}>
        <ActivityIndicator size="large" color="#7EB141" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ 
          headerStyle: { backgroundColor: '#101A30' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}>
          {!workerId ? (
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ headerShown: false }} 
            />
          ) : (
            <>
              <Stack.Screen 
                name="Home" 
                component={HomeScreen} 
                options={{ title: 'Ally Waste' }} 
              />
              <Stack.Screen 
                name="RouteDetail" 
                component={RouteDetailScreen} 
                options={{ title: 'Today\'s Route' }} 
              />
              <Stack.Screen 
                name="StopDetail" 
                component={StopDetailScreen} 
                options={{ title: 'Stop Actions' }} 
              />
            </>
          )}
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </QueryClientProvider>
  );
}
