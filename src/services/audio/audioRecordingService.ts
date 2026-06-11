import {
  AudioModule,
  createAudioPlayer,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  type AudioRecorder,
} from 'expo-audio';
import { AUDIO_RECORDING_OPTIONS } from '../../constants/config';

export type RecordingState = 'idle' | 'recording' | 'paused';

export class AudioPermissionError extends Error {
  constructor() {
    super('Microphone permission is required to record audio.');
    this.name = 'AudioPermissionError';
  }
}

export class AudioRecordingError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'AudioRecordingError';
    this.cause = cause;
  }
}

const RECORDING_OPTIONS = {
  ...RecordingPresets.HIGH_QUALITY,
  numberOfChannels: AUDIO_RECORDING_OPTIONS.numberOfChannels,
};

let activeRecording: AudioRecorder | null = null;

export async function requestAudioPermissions(): Promise<boolean> {
  const permission = await requestRecordingPermissionsAsync();
  return permission.granted;
}

export async function configureAudioSession(): Promise<void> {
  await setAudioModeAsync({
    allowsRecording: true,
    playsInSilentMode: true,
  });
}

export async function startRecording(): Promise<void> {
  const granted = await requestAudioPermissions();
  if (!granted) {
    throw new AudioPermissionError();
  }

  await configureAudioSession();

  if (activeRecording) {
    await stopRecording();
  }

  const recording = new AudioModule.AudioRecorder(RECORDING_OPTIONS);
  try {
    await recording.prepareToRecordAsync();
    recording.record();
    activeRecording = recording;
  } catch (error) {
    throw new AudioRecordingError('Failed to start recording.', error);
  }
}

export async function stopRecording(): Promise<string> {
  if (!activeRecording) {
    throw new AudioRecordingError('No active recording session.');
  }

  try {
    await activeRecording.stop();
    const uri = activeRecording.uri;
    activeRecording = null;

    if (!uri) {
      throw new AudioRecordingError('Recording URI is unavailable.');
    }

    return uri;
  } catch (error) {
    activeRecording = null;
    if (error instanceof AudioRecordingError) {
      throw error;
    }
    throw new AudioRecordingError('Failed to stop recording.', error);
  }
}

export async function cancelRecording(): Promise<void> {
  if (!activeRecording) {
    return;
  }

  try {
    await activeRecording.stop();
  } finally {
    activeRecording = null;
  }
}

export function isRecordingActive(): boolean {
  return activeRecording !== null;
}

export async function playAudio(uri: string): Promise<void> {
  await configureAudioSession();
  const player = createAudioPlayer({ uri });

  await new Promise<void>((resolve, reject) => {
    const subscription = player.addListener('playbackStatusUpdate', (status) => {
      if (!status.isLoaded) {
        return;
      }
      if (status.didJustFinish) {
        subscription.remove();
        player.remove();
        resolve();
      }
    });

    try {
      player.play();
    } catch (error) {
      subscription.remove();
      player.remove();
      reject(error);
    }
  });
}

export function getRecordingExtension(): string {
  return AUDIO_RECORDING_OPTIONS.extension;
}
