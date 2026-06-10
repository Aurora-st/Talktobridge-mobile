import { AUDIO_RECORDING_OPTIONS, TRANSLATE_SPEECH_TIMEOUT_MS } from '../../constants/config';
import type { TranslateSpeechRequest, TranslationResponse } from '../../types/api';
import { postMultipart, resolveBackendUrl } from './httpClient';

const TRANSLATE_SPEECH_PATH = '/translate-speech';

function buildTranslateSpeechFormData(request: TranslateSpeechRequest): FormData {
  const formData = new FormData();
  formData.append('target_lang', request.target_lang);

  if (request.source_lang) {
    formData.append('source_lang', request.source_lang);
  }

  const fieldName = request.fieldName ?? 'file';
  const fileName = `recording-${Date.now()}${AUDIO_RECORDING_OPTIONS.extension}`;

  formData.append(fieldName, {
    uri: request.audioUri,
    name: fileName,
    type: AUDIO_RECORDING_OPTIONS.mimeType,
  } as unknown as Blob);

  return formData;
}

/**
 * POST /translate-speech
 * Content-Type: multipart/form-data
 * Fields: target_lang (required), source_lang (optional), file | audio
 */
export async function translateSpeech(
  request: TranslateSpeechRequest,
): Promise<TranslationResponse> {
  const formData = buildTranslateSpeechFormData(request);

  const response = await postMultipart<TranslationResponse>(
    TRANSLATE_SPEECH_PATH,
    formData,
    { timeout: TRANSLATE_SPEECH_TIMEOUT_MS },
  );

  return {
    ...response,
    audio_url: resolveBackendUrl(response.audio_url),
  };
}
