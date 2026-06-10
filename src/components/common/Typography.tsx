import React from 'react';
import { Text, type TextProps, type TextStyle } from 'react-native';
import { FONT_SIZE } from '../../constants/layout';
import { useTheme } from '../../hooks/useTheme';

type TypographyVariant =
  | 'hero'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'caption'
  | 'label';

interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: 'primary' | 'secondary' | 'muted' | 'accent' | 'danger';
  weight?: TextStyle['fontWeight'];
}

const VARIANT_STYLES: Record<TypographyVariant, TextStyle> = {
  hero: { fontSize: FONT_SIZE.hero, fontWeight: '700', lineHeight: 48 },
  title: { fontSize: FONT_SIZE.xl, fontWeight: '700', lineHeight: 32 },
  subtitle: { fontSize: FONT_SIZE.lg, fontWeight: '600', lineHeight: 28 },
  body: { fontSize: FONT_SIZE.md, fontWeight: '400', lineHeight: 24 },
  caption: { fontSize: FONT_SIZE.sm, fontWeight: '400', lineHeight: 20 },
  label: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    lineHeight: 16,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
};

export function Typography({
  variant = 'body',
  color = 'primary',
  weight,
  style,
  children,
  ...rest
}: TypographyProps) {
  const { theme } = useTheme();

  const colorMap = {
    primary: theme.colors.textPrimary,
    secondary: theme.colors.textSecondary,
    muted: theme.colors.textMuted,
    accent: theme.colors.accent,
    danger: theme.colors.danger,
  };

  return (
    <Text
      style={[
        VARIANT_STYLES[variant],
        { color: colorMap[color] },
        weight ? { fontWeight: weight } : null,
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}
