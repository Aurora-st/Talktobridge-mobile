import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { DEFAULT_SETTINGS, type AppSettings } from '../types/settings';
import { loadSettings, saveSettings } from '../services/storage/settingsRepository';
import { configureHttpClient } from '../services/api/httpClient';

interface SettingsContextValue {
  settings: AppSettings;
  isLoading: boolean;
  updateSettings: (patch: Partial<AppSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
}

export const SettingsContext = createContext<SettingsContextValue | null>(null);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        const stored = await loadSettings();
        if (mounted) {
          setSettings(stored);
          configureHttpClient(stored.apiBaseUrl, stored.apiKey);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void bootstrap();
    return () => {
      mounted = false;
    };
  }, []);

  const updateSettings = useCallback(async (patch: Partial<AppSettings>) => {
    setSettings((current) => {
      const next = { ...current, ...patch };
      configureHttpClient(next.apiBaseUrl, next.apiKey);
      void saveSettings(next);
      return next;
    });
  }, []);

  const resetSettings = useCallback(async () => {
    const next = { ...DEFAULT_SETTINGS };
    setSettings(next);
    configureHttpClient(next.apiBaseUrl, next.apiKey);
    await saveSettings(next);
  }, []);

  const value = useMemo(
    () => ({ settings, isLoading, updateSettings, resetSettings }),
    [settings, isLoading, updateSettings, resetSettings],
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}
