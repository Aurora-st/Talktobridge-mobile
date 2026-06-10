import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { BORDER_RADIUS, SPACING } from '../../constants/layout';
import { SUPPORTED_LANGUAGES } from '../../constants/languages';
import { useTheme } from '../../hooks/useTheme';
import { Typography } from '../common/Typography';

interface LanguageSelectorProps {
  selectedCode: string;
  onSelect: (code: string) => void;
  label: string;
}

export function LanguageSelector({
  selectedCode,
  onSelect,
  label,
}: LanguageSelectorProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Typography variant="label" color="muted" style={styles.label}>
        {label}
      </Typography>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {SUPPORTED_LANGUAGES.map((language) => {
          const isSelected = language.code === selectedCode;
          return (
            <Pressable
              key={language.code}
              onPress={() => onSelect(language.code)}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected
                    ? theme.colors.accent
                    : theme.colors.glassBackground,
                  borderColor: isSelected
                    ? theme.colors.accent
                    : theme.colors.glassBorder,
                },
              ]}
            >
              <Typography
                variant="caption"
                weight="600"
                style={{
                  color: isSelected ? '#FFFFFF' : theme.colors.textPrimary,
                }}
              >
                {language.nativeLabel}
              </Typography>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
  },
  label: {
    marginLeft: SPACING.xs,
  },
  scroll: {
    gap: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  chip: {
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
});
