import React, { type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { BORDER_RADIUS, SPACING } from '../../constants/layout';
import { useTheme } from '../../hooks/useTheme';

interface GlassCardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  padding?: number;
}

export function GlassCard({
  children,
  style,
  intensity = 40,
  padding = SPACING.md,
}: GlassCardProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.wrapper,
        {
          borderColor: theme.colors.glassBorder,
          shadowColor: theme.colors.shadow,
        },
        style,
      ]}
    >
      <BlurView
        intensity={intensity}
        tint={theme.dark ? 'dark' : 'light'}
        style={[
          styles.blur,
          {
            backgroundColor: theme.colors.glassBackground,
            padding,
          },
        ]}
      >
        {children}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 6,
  },
  blur: {
    borderRadius: BORDER_RADIUS.lg,
  },
});
