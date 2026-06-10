export type ThemeMode = 'light' | 'dark' | 'system';

export interface AppSettings {
  themeMode: ThemeMode;
  sourceLanguage: string;
  targetLanguage: string;
  apiBaseUrl: string;
  apiKey: string;
  hapticFeedback: boolean;
  autoPlayResponses: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  themeMode: 'system',
  sourceLanguage: 'en',
  targetLanguage: 'es',
  apiBaseUrl: '',
  apiKey: '',
  hapticFeedback: true,
  autoPlayResponses: true,
};
