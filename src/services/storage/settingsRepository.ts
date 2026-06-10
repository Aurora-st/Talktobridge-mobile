import { DEFAULT_SETTINGS, type AppSettings } from '../../types/settings';
import { STORAGE_KEYS } from './storageKeys';
import { getItem, setItem } from './asyncStorageService';

export async function loadSettings(): Promise<AppSettings> {
  const stored = await getItem<AppSettings>(STORAGE_KEYS.SETTINGS);
  if (!stored) {
    return { ...DEFAULT_SETTINGS };
  }
  return { ...DEFAULT_SETTINGS, ...stored };
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await setItem(STORAGE_KEYS.SETTINGS, settings);
}
