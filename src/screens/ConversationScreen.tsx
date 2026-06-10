import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPACING } from '../constants/layout';
import {
  getValidSourceLanguages,
  getValidTargetLanguages,
  isSupportedLanguage,
  isSupportedPair,
  SUPPORTED_LANGUAGES,
  type LanguageCode,
} from '../constants/languages';
import type { Conversation, ConversationMessage } from '../types/conversation';
import type { RootStackParamList } from '../types/navigation';
import { GlassCard } from '../components/common/GlassCard';
import { GradientBackground } from '../components/common/GradientBackground';
import { IconButton } from '../components/common/IconButton';
import { LoadingOverlay } from '../components/common/LoadingOverlay';
import { Typography } from '../components/common/Typography';
import { LanguageSelector } from '../components/conversation/LanguageSelector';
import { MessageBubble } from '../components/conversation/MessageBubble';
import { RecordButton } from '../components/conversation/RecordButton';
import { useAudioRecording } from '../hooks/useAudioRecording';
import { useConversations } from '../hooks/useConversations';
import { usePipelineStage } from '../hooks/usePipelineStage';
import { useSettings } from '../hooks/useSettings';
import { useTheme } from '../hooks/useTheme';
import { ApiRequestError, isApiConfigured } from '../services/api/httpClient';
import { translateSpeech } from '../services/api/translationService';
import { playAudio } from '../services/audio/audioRecordingService';

type ConversationRoute = RouteProp<RootStackParamList, 'Conversation'>;
type ConversationNavigation = NativeStackNavigationProp<RootStackParamList>;

export function ConversationScreen() {
  const navigation = useNavigation<ConversationNavigation>();
  const route = useRoute<ConversationRoute>();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { settings } = useSettings();
  const {
    activeConversation,
    createConversation,
    loadConversation,
    appendMessage,
    setActiveConversation,
  } = useConversations();

  const [sourceLanguage, setSourceLanguage] = useState<LanguageCode>(
    isSupportedLanguage(settings.sourceLanguage) ? settings.sourceLanguage : 'en',
  );
  const [targetLanguage, setTargetLanguage] = useState<LanguageCode>(
    isSupportedLanguage(settings.targetLanguage) ? settings.targetLanguage : 'es',
  );

  const conversationRef = useRef<Conversation | null>(null);
  const {
    stage,
    message: pipelineMessage,
    setPipelineStage,
    startProcessingStages,
    resetStage,
    isBusy,
  } = usePipelineStage();

  const {
    isRecording,
    isProcessing: isRecordingProcessing,
    error: recordingError,
    beginRecording,
    endRecording,
    clearError,
  } = useAudioRecording();

  const messages = activeConversation?.messages ?? [];
  const listRef = useRef<FlatList<ConversationMessage>>(null);

  const sourceOptions = useMemo(
    () =>
      SUPPORTED_LANGUAGES.filter((language) =>
        getValidSourceLanguages(targetLanguage).includes(language.code),
      ),
    [targetLanguage],
  );

  const targetOptions = useMemo(
    () =>
      SUPPORTED_LANGUAGES.filter((language) =>
        getValidTargetLanguages(sourceLanguage).includes(language.code),
      ),
    [sourceLanguage],
  );

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      if (route.params?.conversationId) {
        const existing = await loadConversation(route.params.conversationId);
        if (mounted && existing) {
          conversationRef.current = existing;
          if (isSupportedLanguage(existing.sourceLanguage)) {
            setSourceLanguage(existing.sourceLanguage);
          }
          if (isSupportedLanguage(existing.targetLanguage)) {
            setTargetLanguage(existing.targetLanguage);
          }
        }
        return;
      }

      const initialSource = isSupportedLanguage(settings.sourceLanguage)
        ? settings.sourceLanguage
        : 'en';
      const initialTarget = isSupportedLanguage(settings.targetLanguage)
        ? settings.targetLanguage
        : 'es';

      const created = await createConversation({
        sourceLanguage: initialSource,
        targetLanguage: initialTarget,
      });
      if (mounted) {
        conversationRef.current = created;
        setSourceLanguage(initialSource);
        setTargetLanguage(initialTarget);
      }
    }

    void initialize();

    return () => {
      mounted = false;
      setActiveConversation(null);
      resetStage();
    };
  }, [
    route.params?.conversationId,
    loadConversation,
    createConversation,
    setActiveConversation,
    resetStage,
    settings.sourceLanguage,
    settings.targetLanguage,
  ]);

  useEffect(() => {
    if (activeConversation) {
      conversationRef.current = activeConversation;
    }
  }, [activeConversation]);

  useEffect(() => {
    if (recordingError) {
      Alert.alert('Recording Error', recordingError, [
        { text: 'OK', onPress: clearError },
      ]);
    }
  }, [recordingError, clearError]);

  useEffect(() => {
    if (!sourceOptions.some((item) => item.code === sourceLanguage)) {
      const fallback = sourceOptions[0]?.code;
      if (fallback) {
        setSourceLanguage(fallback);
      }
    }
  }, [sourceLanguage, sourceOptions]);

  useEffect(() => {
    if (!targetOptions.some((item) => item.code === targetLanguage)) {
      const fallback = targetOptions[0]?.code;
      if (fallback) {
        setTargetLanguage(fallback);
      }
    }
  }, [targetLanguage, targetOptions]);

  const scrollToEnd = useCallback(() => {
    if (messages.length > 0) {
      listRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages.length]);

  useEffect(() => {
    scrollToEnd();
  }, [messages, scrollToEnd]);

  const handlePlayAudio = useCallback(async (uri: string) => {
    try {
      await playAudio(uri);
    } catch {
      Alert.alert('Playback Error', 'Unable to play this audio clip.');
    }
  }, []);

  const processRecording = useCallback(
    async (audioUri: string) => {
      const conversation = conversationRef.current;
      if (!conversation) {
        return;
      }

      if (!isApiConfigured()) {
        Alert.alert(
          'Backend Not Configured',
          'Set the backend URL in Settings before starting a voice session.',
        );
        return;
      }

      if (!isSupportedPair(sourceLanguage, targetLanguage)) {
        Alert.alert(
          'Unsupported Language Pair',
          `Translation from ${sourceLanguage.toUpperCase()} to ${targetLanguage.toUpperCase()} is not supported by the backend.`,
        );
        return;
      }

      setPipelineStage('uploading');

      try {
        startProcessingStages();

        const result = await translateSpeech({
          audioUri,
          target_lang: targetLanguage,
          source_lang: sourceLanguage,
        });

        const detectedSource = isSupportedLanguage(result.detected_language)
          ? result.detected_language
          : sourceLanguage;

        await appendMessage(
          conversation.id,
          'user',
          result.source_text,
          audioUri,
          detectedSource,
          targetLanguage,
        );

        await appendMessage(
          conversation.id,
          'assistant',
          result.translated_text,
          result.audio_url,
          detectedSource,
          targetLanguage,
        );

        if (settings.autoPlayResponses && result.audio_url) {
          setPipelineStage('synthesizing');
          await playAudio(result.audio_url);
        }
      } catch (error) {
        const message =
          error instanceof ApiRequestError
            ? error.message
            : error instanceof Error
              ? error.message
              : 'Voice translation failed.';
        Alert.alert('Translation Error', message);
      } finally {
        resetStage();
      }
    },
    [
      appendMessage,
      sourceLanguage,
      targetLanguage,
      settings.autoPlayResponses,
      setPipelineStage,
      startProcessingStages,
      resetStage,
    ],
  );

  const handlePressIn = useCallback(() => {
    if (isBusy || isRecordingProcessing) {
      return;
    }
    setPipelineStage('recording');
    void beginRecording();
  }, [beginRecording, isBusy, isRecordingProcessing, setPipelineStage]);

  const handlePressOut = useCallback(async () => {
    if (!isRecording) {
      return;
    }
    const uri = await endRecording();
    if (uri) {
      await processRecording(uri);
    } else {
      resetStage();
    }
  }, [isRecording, endRecording, processRecording, resetStage]);

  const showOverlay = isBusy && stage !== 'recording';
  const overlayMessage =
    stage === 'recording' ? '' : pipelineMessage;

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View
          style={[
            styles.topBar,
            {
              paddingTop: insets.top + SPACING.sm,
              borderBottomColor: theme.colors.glassBorder,
            },
          ]}
        >
          <IconButton name="chevron-back" onPress={() => navigation.goBack()} />
          <View style={styles.topBarTitle}>
            <Typography variant="subtitle" numberOfLines={1}>
              {activeConversation?.title ?? 'Conversation'}
            </Typography>
            <Typography variant="caption" color="muted">
              {stage === 'recording' ? 'Recording…' : 'Hold to speak'}
            </Typography>
          </View>
          <View style={styles.topBarSpacer} />
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.messageList,
            messages.length === 0 && styles.messageListEmpty,
          ]}
          renderItem={({ item }) => (
            <MessageBubble message={item} onPlayAudio={handlePlayAudio} />
          )}
          ListEmptyComponent={
            <GlassCard style={styles.emptyState}>
              <Typography variant="subtitle">Ready to translate</Typography>
              <Typography variant="body" color="secondary">
                Press and hold the microphone to record. On release, your audio
                is uploaded to the backend for transcription, translation, and
                speech synthesis.
              </Typography>
            </GlassCard>
          }
        />

        <View
          style={[
            styles.footer,
            {
              paddingBottom: insets.bottom + SPACING.md,
              borderTopColor: theme.colors.glassBorder,
            },
          ]}
        >
          <LanguageSelector
            label="From"
            selectedCode={sourceLanguage}
            onSelect={(code) => {
              if (isSupportedLanguage(code)) {
                setSourceLanguage(code);
              }
            }}
            languages={sourceOptions}
            disabled={isBusy}
          />
          <LanguageSelector
            label="To"
            selectedCode={targetLanguage}
            onSelect={(code) => {
              if (isSupportedLanguage(code)) {
                setTargetLanguage(code);
              }
            }}
            languages={targetOptions}
            disabled={isBusy}
          />
          <View style={styles.recordRow}>
            <RecordButton
              isRecording={isRecording}
              isProcessing={isRecordingProcessing || isBusy}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              disabled={isBusy && !isRecording}
            />
          </View>
        </View>
      </KeyboardAvoidingView>

      <LoadingOverlay visible={showOverlay} message={overlayMessage} />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: SPACING.sm,
  },
  topBarTitle: {
    flex: 1,
    alignItems: 'center',
  },
  topBarSpacer: {
    width: 44,
  },
  messageList: {
    padding: SPACING.md,
    flexGrow: 1,
  },
  messageListEmpty: {
    justifyContent: 'center',
  },
  emptyState: {
    gap: SPACING.sm,
  },
  footer: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: SPACING.md,
  },
  recordRow: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
});
