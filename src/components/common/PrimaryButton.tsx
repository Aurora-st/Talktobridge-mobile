import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BORDER_RADIUS, HIT_SLOP, SPACING } from '../../constants/layout';
import { useTheme } from '../../hooks/useTheme';
import { Typography } from './Typography';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  variant?: 'primary' | 'danger' | 'ghost';
}

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  style,
  variant = 'primary',
}: PrimaryButtonProps) {
  const { theme } = useTheme();
  const isDisabled = disabled || loading;

  if (variant === 'ghost') {
    return (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        hitSlop={HIT_SLOP}
        style={({ pressed }) => [
          styles.ghost,
          {
            borderColor: theme.colors.glassBorder,
            backgroundColor: pressed
              ? theme.colors.inputBackground
              : 'transparent',
            opacity: isDisabled ? 0.5 : 1,
          },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.accent} />
        ) : (
          <Typography variant="body" color="accent" weight="600">
            {label}
          </Typography>
        )}
      </Pressable>
    );
  }

  const gradientColors =
    variant === 'danger'
      ? ([theme.colors.danger, '#E11D48'] as const)
      : ([theme.colors.accent, theme.colors.accentSecondary] as const);

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      hitSlop={HIT_SLOP}
      style={({ pressed }) => [
        styles.wrapper,
        { opacity: isDisabled ? 0.55 : pressed ? 0.88 : 1 },
        style,
      ]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Typography variant="body" weight="600" style={styles.label}>
            {label}
          </Typography>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  label: {
    color: '#FFFFFF',
  },
  ghost: {
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
});
