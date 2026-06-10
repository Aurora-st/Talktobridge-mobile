import { PALETTE } from './colors';

export interface ThemeColors {
  background: string;
  backgroundSecondary: string;
  gradientStart: string;
  gradientMiddle: string;
  gradientEnd: string;
  glassBackground: string;
  glassBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentSecondary: string;
  success: string;
  danger: string;
  warning: string;
  tabBar: string;
  tabBarBorder: string;
  inputBackground: string;
  shadow: string;
  statusBar: 'light' | 'dark';
}

export interface AppTheme {
  dark: boolean;
  colors: ThemeColors;
}

const lightColors: ThemeColors = {
  background: PALETTE.slate50,
  backgroundSecondary: PALETTE.slate100,
  gradientStart: '#EEF2FF',
  gradientMiddle: '#F5F3FF',
  gradientEnd: '#ECFEFF',
  glassBackground: 'rgba(255, 255, 255, 0.55)',
  glassBorder: 'rgba(255, 255, 255, 0.75)',
  textPrimary: PALETTE.slate900,
  textSecondary: PALETTE.slate700,
  textMuted: PALETTE.slate500,
  accent: PALETTE.indigo600,
  accentSecondary: PALETTE.violet500,
  success: PALETTE.emerald400,
  danger: PALETTE.rose400,
  warning: PALETTE.amber400,
  tabBar: 'rgba(255, 255, 255, 0.82)',
  tabBarBorder: 'rgba(148, 163, 184, 0.25)',
  inputBackground: 'rgba(255, 255, 255, 0.65)',
  shadow: 'rgba(15, 23, 42, 0.12)',
  statusBar: 'dark',
};

const darkColors: ThemeColors = {
  background: PALETTE.slate950,
  backgroundSecondary: PALETTE.slate900,
  gradientStart: '#0F172A',
  gradientMiddle: '#1E1B4B',
  gradientEnd: '#042F2E',
  glassBackground: 'rgba(15, 23, 42, 0.55)',
  glassBorder: 'rgba(148, 163, 184, 0.18)',
  textPrimary: PALETTE.slate50,
  textSecondary: PALETTE.slate200,
  textMuted: PALETTE.slate400,
  accent: PALETTE.indigo500,
  accentSecondary: PALETTE.violet500,
  success: PALETTE.emerald400,
  danger: PALETTE.rose400,
  warning: PALETTE.amber400,
  tabBar: 'rgba(15, 23, 42, 0.88)',
  tabBarBorder: 'rgba(148, 163, 184, 0.12)',
  inputBackground: 'rgba(30, 41, 59, 0.65)',
  shadow: 'rgba(0, 0, 0, 0.45)',
  statusBar: 'light',
};

export const LIGHT_THEME: AppTheme = { dark: false, colors: lightColors };
export const DARK_THEME: AppTheme = { dark: true, colors: darkColors };
