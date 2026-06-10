import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { useSettings } from '../hooks/useSettings';
import { useTheme } from '../hooks/useTheme';
import { isApiConfigured } from '../services/api/httpClient';
import {
  synthesizeSpeech,
  transcribeAudio,
  translateText,
} from '../services/api/translationService';
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

  const [sourceLanguage, setSourceLanguage] = useState(settings.sourceLanguage);
  const [targetLanguage, setTargetLanguage] = useState(settings.targetLanguage);
  const [isProcessingPipeline, setIsProcessingPipeline] = useState(false);
  const [pipelineMessage, setPipelineMessage] = useState('');
  const conversationRef = useRef<Conversation | null>(null);

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

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      if (route.params?.conversationId) {
        const existing = await loadConversation(route.params.conversationId);
        if (mounted && existing) {
          conversationRef.current = existing;
          setSourceLanguage(existing.sourceLanguage);
          setTargetLanguage(existing.targetLanguage);
        }
        return;
      }

      const created = await createConversation({
        sourceLanguage: settings.sourceLanguage,
        targetLanguage: settings.targetLanguage,
      });
      if (mounted) {
        conversationRef.current = created;
      }
    }

    void initialize();

    return () => {
      mounted = false;
      setActiveConversation(null);
    };
  }, [
    route.params?.conversationId,
    loadConversation,
    createConversation,
    settings.sourceLanguage,
    settings.targetLanguage,
    setActiveConversation,
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
          'API Not Configured',
          'Configure your API base URL in Settings before starting a voice session.',
        );
        return;
      }

      setIsProcessingPipeline(true);

      try {
        setPipelineMessage('Transcribing your voice…');
        const transcription = await transcribeAudio({
          audioUri,
          language: sourceLanguage,
        });

        await appendMessage(
          conversation.id,
          'user',
          transcription.text,
          audioUri,
          sourceLanguage,
          targetLanguage,
        );

        setPipelineMessage('Translating…');
        const translation = await translateText({
          text: transcription.text,
          sourceLanguage,
          targetLanguage,
        });

        let responseAudioUri: string | null = null;

        if (settings.autoPlayResponses) {
          setPipelineMessage('Generating speech…');
          const synthesis = await synthesizeSpeech({
            text: translation.translatedText,
            language: targetLanguage,
          });
          responseAudioUri = synthesis.audioUri;
        }

        await appendMessage(
          conversation.id,
          'assistant',
          translation.translatedText,
          responseAudioUri,
          sourceLanguage,
          targetLanguage,
        );

        if (responseAudioUri) {
          await playAudio(responseAudioUri);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Processing failed.';
        Alert.alert('Conversation Error', message);
      } finally {
        setIsProcessingPipeline(false);
        setPipelineMessage('');
      }
    },
    [
      appendMessage,
      sourceLanguage,
      targetLanguage,
      settings.autoPlayResponses,
    ],
  );

  const handlePressIn = useCallback(() => {
    if (isProcessingPipeline || isRecordingProcessing) {
      return;
    }
    void beginRecording();
  }, [beginRecording, isProcessingPipeline, isRecordingProcessing]);

  const handlePressOut = useCallback(async () => {
    if (!isRecording) {
      return;
    }
    const uri = await endRecording();
    if (uri) {
      await processRecording(uri);
    }
  }, [isRecording, endRecording, processRecording]);

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
              Hold to speak
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
                Press and hold the microphone button below to record your
                message. Release to transcribe, translate, and hear the response.
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
            onSelect={setSourceLanguage}
          />
          <LanguageSelector
            label="To"
            selectedCode={targetLanguage}
            onSelect={setTargetLanguage}
          />
          <View style={styles.recordRow}>
            <RecordButton
              isRecording={isRecording}
              isProcessing={isRecordingProcessing || isProcessingPipeline}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              disabled={isProcessingPipeline}
            />
          </View>
        </View>
      </KeyboardAvoidingView>

      <LoadingOverlay visible={isProcessingPipeline} message={pipelineMessage} />
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
