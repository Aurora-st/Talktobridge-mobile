import React, { useCallback, type ReactNode } from 'react';
import type { ThemeMode } from '../types/settings';
import { ConversationProvider } from './ConversationProvider';
import { SettingsContext, SettingsProvider } from './SettingsProvider';
import { ThemeProvider } from './ThemeProvider';

interface AppProvidersProps {
  children: ReactNode;
}

function ThemedApp({ children }: { children: ReactNode }) {
  const settingsContext = React.useContext(SettingsContext);

  if (!settingsContext) {
    throw new Error('ThemedApp must be rendered within SettingsProvider.');
  }

  const { settings, updateSettings } = settingsContext;

  const handleModeChange = useCallback(
    (mode: ThemeMode) => {
      void updateSettings({ themeMode: mode });
    },
    [updateSettings],
  );

  return (
    <ThemeProvider
      initialMode={settings.themeMode}
      onModeChange={handleModeChange}
    >
      <ConversationProvider>{children}</ConversationProvider>
    </ThemeProvider>
  );
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <SettingsProvider>
      <ThemedApp>{children}</ThemedApp>
    </SettingsProvider>
  );
}
