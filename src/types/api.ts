export interface TranscriptionRequest {
  audioUri: string;
  language: string;
}

export interface TranscriptionResponse {
  text: string;
  confidence: number;
}

export interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface TranslationResponse {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface SynthesisRequest {
  text: string;
  language: string;
}

export interface SynthesisResponse {
  audioUri: string;
}

export interface ApiErrorPayload {
  message: string;
  code: string;
}
