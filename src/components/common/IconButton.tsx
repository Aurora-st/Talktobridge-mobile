import React from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BORDER_RADIUS, HIT_SLOP } from '../../constants/layout';
import { useTheme } from '../../hooks/useTheme';

interface IconButtonProps {
  name: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export function IconButton({
  name,
  onPress,
  size = 22,
  color,
  style,
  disabled = false,
}: IconButtonProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={HIT_SLOP}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: pressed
            ? theme.colors.inputBackground
            : theme.colors.glassBackground,
          borderColor: theme.colors.glassBorder,
          opacity: disabled ? 0.45 : 1,
        },
        style,
      ]}
    >
      <Ionicons
        name={name}
        size={size}
        color={color ?? theme.colors.textPrimary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
