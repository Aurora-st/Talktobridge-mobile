export type LanguageCode = 'en' | 'hi' | 'ja' | 'es' | 'ta';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
];

export const SUPPORTED_PAIRS: ReadonlyArray<readonly [LanguageCode, LanguageCode]> = [
  ['ja', 'en'],
  ['en', 'hi'],
  ['hi', 'en'],
  ['en', 'es'],
  ['es', 'en'],
  ['ta', 'hi'],
  ['hi', 'ta'],
];

export function getLanguageLabel(code: string): string {
  const language = SUPPORTED_LANGUAGES.find((item) => item.code === code);
  return language?.label ?? code.toUpperCase();
}

export function getLanguageNativeLabel(code: string): string {
  const language = SUPPORTED_LANGUAGES.find((item) => item.code === code);
  return language?.nativeLabel ?? code.toUpperCase();
}

export function isSupportedLanguage(code: string): code is LanguageCode {
  return SUPPORTED_LANGUAGES.some((item) => item.code === code);
}

export function isSupportedPair(sourceLang: string, targetLang: string): boolean {
  if (sourceLang === targetLang) {
    return false;
  }
  return SUPPORTED_PAIRS.some(
    ([source, target]) => source === sourceLang && target === targetLang,
  );
}

export function getValidTargetLanguages(sourceLang: LanguageCode): LanguageCode[] {
  return SUPPORTED_PAIRS.filter(([source]) => source === sourceLang).map(
    ([, target]) => target,
  );
}

export function getValidSourceLanguages(targetLang: LanguageCode): LanguageCode[] {
  return SUPPORTED_PAIRS.filter(([, target]) => target === targetLang).map(
    ([source]) => source,
  );
}
