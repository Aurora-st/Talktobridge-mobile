import { useCallback, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';
import {
  cancelRecording,
  isRecordingActive,
  startRecording,
  stopRecording,
} from '../services/audio/audioRecordingService';
import { useSettings } from './useSettings';

export type AudioRecordingStatus = 'idle' | 'recording' | 'processing';

export function useAudioRecording() {
  const { settings } = useSettings();
  const [status, setStatus] = useState<AudioRecordingStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const recordingStartRef = useRef<number | null>(null);

  const triggerHaptic = useCallback(() => {
    if (settings.hapticFeedback) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [settings.hapticFeedback]);

  const beginRecording = useCallback(async () => {
    setError(null);
    try {
      await startRecording();
      recordingStartRef.current = Date.now();
      setStatus('recording');
      triggerHaptic();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Recording failed.';
      setError(message);
      setStatus('idle');
    }
  }, [triggerHaptic]);

  const endRecording = useCallback(async (): Promise<string | null> => {
    if (!isRecordingActive()) {
      return null;
    }

    setStatus('processing');
    triggerHaptic();

    try {
      const uri = await stopRecording();
      setStatus('idle');
      return uri;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save recording.';
      setError(message);
      setStatus('idle');
      return null;
    }
  }, [triggerHaptic]);

  const discardRecording = useCallback(async () => {
    await cancelRecording();
    recordingStartRef.current = null;
    setStatus('idle');
    setError(null);
  }, []);

  const recordingDurationMs =
    status === 'recording' && recordingStartRef.current
      ? Date.now() - recordingStartRef.current
      : 0;

  return {
    status,
    error,
    isRecording: status === 'recording',
    isProcessing: status === 'processing',
    recordingDurationMs,
    beginRecording,
    endRecording,
    discardRecording,
    clearError: () => setError(null),
  };
}
