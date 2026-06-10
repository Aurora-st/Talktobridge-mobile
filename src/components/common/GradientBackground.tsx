import React, { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';

interface GradientBackgroundProps {
  children: ReactNode;
}

export function GradientBackground({ children }: GradientBackgroundProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          theme.colors.gradientStart,
          theme.colors.gradientMiddle,
          theme.colors.gradientEnd,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
