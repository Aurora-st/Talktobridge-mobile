export const APP_NAME = 'TalkBridge AI';

export const API_TIMEOUT_MS = 30_000;

export const TRANSLATE_SPEECH_TIMEOUT_MS = 120_000;

export const API_RETRY_ATTEMPTS = 3;

export const API_RETRY_DELAY_MS = 1_000;

export const STORAGE_VERSION = 1;

export const MAX_CONVERSATION_TITLE_LENGTH = 60;

export const AUDIO_RECORDING_OPTIONS = {
  extension: '.m4a',
  sampleRate: 44100,
  numberOfChannels: 1,
  bitRate: 128000,
  mimeType: 'audio/mp4',
} as const;

export const DEFAULT_API_BASE_URL = 'http://10.54.132.214:8000';
