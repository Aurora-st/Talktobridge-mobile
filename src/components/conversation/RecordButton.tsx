import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BORDER_RADIUS } from '../../constants/layout';
import { useTheme } from '../../hooks/useTheme';

interface RecordButtonProps {
  isRecording: boolean;
  isProcessing: boolean;
  onPressIn: () => void;
  onPressOut: () => void;
  disabled?: boolean;
}

export function RecordButton({
  isRecording,
  isProcessing,
  onPressIn,
  onPressOut,
  disabled = false,
}: RecordButtonProps) {
  const { theme } = useTheme();
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRecording) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.12,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      );
      animation.start();
      return () => animation.stop();
    }
    pulse.setValue(1);
    return undefined;
  }, [isRecording, pulse]);

  const iconName = isProcessing
    ? 'hourglass-outline'
    : isRecording
      ? 'stop'
      : 'mic';

  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled || isProcessing}
      style={({ pressed }) => [
        styles.wrapper,
        { opacity: disabled || isProcessing ? 0.5 : pressed ? 0.9 : 1 },
      ]}
    >
      <Animated.View style={{ transform: [{ scale: pulse }] }}>
        <LinearGradient
          colors={
            isRecording
              ? [theme.colors.danger, '#E11D48']
              : [theme.colors.accent, theme.colors.accentSecondary]
          }
          style={styles.button}
        >
          <Ionicons name={iconName} size={32} color="#FFFFFF" />
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
});
