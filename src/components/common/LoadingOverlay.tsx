import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../hooks/useTheme';
import { Typography } from './Typography';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export function LoadingOverlay({ visible, message }: LoadingOverlayProps) {
  const { theme } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <BlurView intensity={30} tint={theme.dark ? 'dark' : 'light'} style={styles.backdrop}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.glassBackground,
              borderColor: theme.colors.glassBorder,
            },
          ]}
        >
          <ActivityIndicator size="large" color={theme.colors.accent} />
          {message ? (
            <Typography variant="body" color="secondary" style={styles.message}>
              {message}
            </Typography>
          ) : null}
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 28,
    alignItems: 'center',
    minWidth: 180,
    gap: 16,
  },
  message: {
    textAlign: 'center',
  },
});
