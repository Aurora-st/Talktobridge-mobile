import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';
import { DARK_THEME, LIGHT_THEME, type AppTheme } from '../constants/theme';
import type { ThemeMode } from '../types/settings';

interface ThemeContextValue {
  theme: AppTheme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
  initialMode: ThemeMode;
  onModeChange: (mode: ThemeMode) => void;
}

export function ThemeProvider({
  children,
  initialMode,
  onModeChange,
}: ThemeProviderProps) {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>(initialMode);

  const resolvedDark =
    themeMode === 'system' ? systemScheme === 'dark' : themeMode === 'dark';

  const theme = resolvedDark ? DARK_THEME : LIGHT_THEME;

  const setThemeMode = useCallback(
    (mode: ThemeMode) => {
      setThemeModeState(mode);
      onModeChange(mode);
    },
    [onModeChange],
  );

  useEffect(() => {
    setThemeModeState(initialMode);
  }, [initialMode]);

  const value = useMemo(
    () => ({ theme, themeMode, setThemeMode }),
    [theme, themeMode, setThemeMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
