import { Audio } from 'expo-av';
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

let activeRecording: Audio.Recording | null = null;

export async function requestAudioPermissions(): Promise<boolean> {
  const permission = await Audio.requestPermissionsAsync();
  return permission.granted;
}

export async function configureAudioSession(): Promise<void> {
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
    staysActiveInBackground: false,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false,
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

  const recording = new Audio.Recording();
  try {
    await recording.prepareToRecordAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY,
    );
    await recording.startAsync();
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
    await activeRecording.stopAndUnloadAsync();
    const uri = activeRecording.getURI();
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
    await activeRecording.stopAndUnloadAsync();
  } finally {
    activeRecording = null;
  }
}

export function isRecordingActive(): boolean {
  return activeRecording !== null;
}

export async function playAudio(uri: string): Promise<void> {
  await configureAudioSession();
  const { sound } = await Audio.Sound.createAsync({ uri }, { shouldPlay: true });
  await new Promise<void>((resolve, reject) => {
    sound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded) {
        return;
      }
      if (status.didJustFinish) {
        void sound.unloadAsync().then(() => resolve()).catch(reject);
      }
    });
  });
}

export function getRecordingExtension(): string {
  return AUDIO_RECORDING_OPTIONS.extension;
}
