import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { MainTabNavigator } from './MainTabNavigator';
import { ConversationScreen } from '../screens/ConversationScreen';
import { useTheme } from '../hooks/useTheme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen
        name="Conversation"
        component={ConversationScreen}
        options={{
          presentation: 'card',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
}
