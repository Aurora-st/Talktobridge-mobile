import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProviders } from './src/store/AppProviders';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useSettings } from './src/hooks/useSettings';
import { useTheme } from './src/hooks/useTheme';

function NavigationRoot() {
  const { theme } = useTheme();
  const { isLoading } = useSettings();

  const navigationTheme = theme.dark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: theme.colors.background,
          card: theme.colors.backgroundSecondary,
          primary: theme.colors.accent,
          text: theme.colors.textPrimary,
          border: theme.colors.glassBorder,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: theme.colors.background,
          card: theme.colors.backgroundSecondary,
          primary: theme.colors.accent,
          text: theme.colors.textPrimary,
          border: theme.colors.glassBorder,
        },
      };

  if (isLoading) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
        <StatusBar style={theme.colors.statusBar} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style={theme.colors.statusBar} />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProviders>
        <NavigationRoot />
      </AppProviders>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
