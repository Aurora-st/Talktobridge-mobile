import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { TAB_BAR_HEIGHT } from '../constants/layout';
import type { MainTabParamList } from '../types/navigation';
import { HomeScreen } from '../screens/HomeScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useTheme } from '../hooks/useTheme';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: [
          styles.tabBar,
          {
            height: TAB_BAR_HEIGHT,
            borderTopColor: theme.colors.tabBarBorder,
            backgroundColor: Platform.OS === 'android' ? theme.colors.tabBar : 'transparent',
          },
        ],
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView
              intensity={60}
              tint={theme.dark ? 'dark' : 'light'}
              style={StyleSheet.absoluteFill}
            />
          ) : null,
        tabBarIcon: ({ color, size, focused }) => {
          const iconMap: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
            Home: focused ? 'home' : 'home-outline',
            History: focused ? 'time' : 'time-outline',
            Settings: focused ? 'settings' : 'settings-outline',
          };
          return <Ionicons name={iconMap[route.name]} size={size} color={color} />;
        },
        tabBarLabelStyle: styles.tabLabel,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    borderTopWidth: StyleSheet.hairlineWidth,
    elevation: 0,
    paddingTop: 6,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: Platform.OS === 'android' ? 8 : 0,
  },
});
