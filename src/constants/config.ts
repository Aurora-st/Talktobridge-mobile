export const APP_NAME = 'TalkBridge AI';

export const API_TIMEOUT_MS = 30_000;

export const STORAGE_VERSION = 1;

export const MAX_CONVERSATION_TITLE_LENGTH = 60;

export const AUDIO_RECORDING_OPTIONS = {
  extension: '.m4a',
  sampleRate: 44100,
  numberOfChannels: 1,
  bitRate: 128000,
} as const;
