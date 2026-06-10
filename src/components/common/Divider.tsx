import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export function Divider() {
  const { theme } = useTheme();
  return (
    <View style={[styles.divider, { backgroundColor: theme.colors.glassBorder }]} />
  );
}

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
});
