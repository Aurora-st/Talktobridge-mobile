export interface Latency {
  asr: number;
  translation: number;
  tts: number;
  total: number;
}

/** POST /translate-speech response — matches backend Swagger exactly. */
export interface TranslationResponse {
  source_text: string;
  translated_text: string;
  audio_url: string;
  detected_language: string;
  confidence: number | null;
  translation_confidence: number | null;
  sentiment: string;
  sentiment_score: number;
  keywords: string[];
  summary: string;
  audio_duration_ms: number | null;
  cached: boolean;
  latency: Latency;
}

/** App-level request for POST /translate-speech (mapped to multipart form fields). */
export interface TranslateSpeechRequest {
  audioUri: string;
  target_lang: string;
  source_lang?: string;
  /** Backend accepts `file` or `audio`; we send `file` by default. */
  fieldName?: 'file' | 'audio';
}

export interface RootHealthResponse {
  status: string;
  version?: string;
}

export interface HealthResponse {
  status: string;
  whisper_model?: string;
  cache_entries?: number;
  database?: string;
  version?: string;
}

export interface AnalyticsStats {
  total_translations: number;
  average_latency_ms: number;
  average_audio_duration_ms: number;
  average_latency_breakdown: Latency;
  cached_responses: number;
  success_rate_percent: number;
  total_requests: number;
  failed_requests: number;
  most_used_language: string | null;
  languages_used: Array<{ lang: string; count: number }>;
  detected_languages: Array<{ lang: string; count: number }>;
  sentiment_distribution: Array<{ sentiment: string; count: number }>;
  cache_stats: {
    entries: number;
    hits: number;
    misses: number;
    hit_rate_percent: number;
  };
}

export interface AnalyticsHistoryRecord {
  id: string;
  created_at: string;
  source_lang: string | null;
  target_lang: string;
  detected_language: string;
  source_text: string;
  translated_text: string;
  confidence: number | null;
  translation_confidence: number | null;
  sentiment: string;
  sentiment_score: number;
  keywords: string[];
  summary: string;
  audio_duration_ms: number | null;
  latency: Latency;
  cached: boolean;
}

export interface AnalyticsHistoryResponse {
  history: AnalyticsHistoryRecord[];
}

export interface BackendErrorBody {
  success?: false;
  error?: {
    type: string;
    message: string;
    status_code: number;
    details?: string;
  };
  detail?: Array<{
    loc: Array<string | number>;
    msg: string;
    type: string;
  }>;
}

export type PipelineStage =
  | 'idle'
  | 'recording'
  | 'uploading'
  | 'transcribing'
  | 'translating'
  | 'synthesizing';

export const PIPELINE_STAGE_LABELS: Record<PipelineStage, string> = {
  idle: '',
  recording: 'Recording…',
  uploading: 'Uploading audio…',
  transcribing: 'Transcribing…',
  translating: 'Translating…',
  synthesizing: 'Synthesizing speech…',
};
