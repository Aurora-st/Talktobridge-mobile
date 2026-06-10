import {
  cacheDirectory,
  EncodingType,
  readAsStringAsync,
  writeAsStringAsync,
} from 'expo-file-system/legacy';
import type {
  SynthesisRequest,
  SynthesisResponse,
  TranscriptionRequest,
  TranscriptionResponse,
  TranslationRequest,
  TranslationResponse,
} from '../../types/api';
import { getHttpClient, parseApiError } from './httpClient';

async function readAudioAsBase64(uri: string): Promise<string> {
  return readAsStringAsync(uri, {
    encoding: EncodingType.Base64,
  });
}

async function writeBase64Audio(base64: string, extension: string): Promise<string> {
  if (!cacheDirectory) {
    throw new Error('Cache directory is unavailable on this device.');
  }
  const fileUri = `${cacheDirectory}tts-${Date.now()}${extension}`;
  await writeAsStringAsync(fileUri, base64, {
    encoding: EncodingType.Base64,
  });
  return fileUri;
}

export async function transcribeAudio(
  request: TranscriptionRequest,
): Promise<TranscriptionResponse> {
  try {
    const audioBase64 = await readAudioAsBase64(request.audioUri);
    const client = getHttpClient();
    const { data } = await client.post<TranscriptionResponse>('/v1/transcribe', {
      audio: audioBase64,
      language: request.language,
      format: 'm4a',
    });
    return data;
  } catch (error) {
    throw parseApiError(error);
  }
}

export async function translateText(
  request: TranslationRequest,
): Promise<TranslationResponse> {
  try {
    const client = getHttpClient();
    const { data } = await client.post<TranslationResponse>('/v1/translate', {
      text: request.text,
      source_language: request.sourceLanguage,
      target_language: request.targetLanguage,
    });
    return data;
  } catch (error) {
    throw parseApiError(error);
  }
}

export async function synthesizeSpeech(
  request: SynthesisRequest,
): Promise<SynthesisResponse> {
  try {
    const client = getHttpClient();
    const { data } = await client.post<{ audio: string; format: string }>('/v1/synthesize', {
      text: request.text,
      language: request.language,
    });
    const extension = data.format?.startsWith('.') ? data.format : `.${data.format ?? 'm4a'}`;
    const audioUri = await writeBase64Audio(data.audio, extension);
    return { audioUri };
  } catch (error) {
    throw parseApiError(error);
  }
}
