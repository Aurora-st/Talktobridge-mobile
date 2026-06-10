export interface LanguageOption {
  code: string;
  label: string;
  nativeLabel: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español' },
  { code: 'fr', label: 'French', nativeLabel: 'Français' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch' },
  { code: 'it', label: 'Italian', nativeLabel: 'Italiano' },
  { code: 'pt', label: 'Portuguese', nativeLabel: 'Português' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語' },
  { code: 'ko', label: 'Korean', nativeLabel: '한국어' },
  { code: 'zh', label: 'Chinese', nativeLabel: '中文' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية' },
  { code: 'ru', label: 'Russian', nativeLabel: 'Русский' },
];

export function getLanguageLabel(code: string): string {
  const language = SUPPORTED_LANGUAGES.find((item) => item.code === code);
  return language?.label ?? code.toUpperCase();
}

export function getLanguageNativeLabel(code: string): string {
  const language = SUPPORTED_LANGUAGES.find((item) => item.code === code);
  return language?.nativeLabel ?? code.toUpperCase();
}
