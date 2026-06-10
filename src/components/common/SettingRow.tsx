import React, { type ReactNode } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { SPACING } from '../../constants/layout';
import { useTheme } from '../../hooks/useTheme';
import { Typography } from './Typography';

interface SettingRowProps {
  title: string;
  description?: string;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  trailing?: ReactNode;
}

export function SettingRow({
  title,
  description,
  value,
  onValueChange,
  trailing,
}: SettingRowProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.row}>
      <View style={styles.textBlock}>
        <Typography variant="body" weight="600">
          {title}
        </Typography>
        {description ? (
          <Typography variant="caption" color="muted" style={styles.description}>
            {description}
          </Typography>
        ) : null}
      </View>
      {typeof value === 'boolean' && onValueChange ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{
            false: theme.colors.backgroundSecondary,
            true: theme.colors.accent,
          }}
          thumbColor="#FFFFFF"
        />
      ) : (
        trailing
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  textBlock: {
    flex: 1,
  },
  description: {
    marginTop: SPACING.xs,
  },
});
