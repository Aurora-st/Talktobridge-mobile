import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { APP_NAME } from '../constants/config';
import { getLanguageLabel } from '../constants/languages';
import { SPACING } from '../constants/layout';
import type { RootStackParamList } from '../types/navigation';
import { GlassCard } from '../components/common/GlassCard';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { Typography } from '../components/common/Typography';
import { useConversations } from '../hooks/useConversations';
import { useSettings } from '../hooks/useSettings';
import { useTheme } from '../hooks/useTheme';
import { isApiConfigured } from '../services/api/httpClient';

type HomeNavigation = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<HomeNavigation>();
  const { theme } = useTheme();
  const { settings } = useSettings();
  const { conversations, isLoading } = useConversations();

  const recentCount = conversations.length;
  const apiReady = isApiConfigured();

  const handleStartConversation = () => {
    navigation.navigate('Conversation', {});
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <View>
          <Typography variant="label" color="accent">
            Welcome to
          </Typography>
          <Typography variant="hero">{APP_NAME}</Typography>
        </View>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: apiReady ? theme.colors.success : theme.colors.warning },
          ]}
        />
      </View>

      <GlassCard style={styles.heroCard} padding={SPACING.lg}>
        <View style={styles.heroIcon}>
          <Ionicons name="language" size={36} color={theme.colors.accent} />
        </View>
        <Typography variant="subtitle">Real-time voice translation</Typography>
        <Typography variant="body" color="secondary" style={styles.heroText}>
          Speak naturally and bridge language barriers with AI-powered
          transcription, translation, and speech synthesis.
        </Typography>
        <View style={styles.languageRow}>
          <Typography variant="caption" color="muted">
            {getLanguageLabel(settings.sourceLanguage)}
          </Typography>
          <Ionicons name="arrow-forward" size={16} color={theme.colors.textMuted} />
          <Typography variant="caption" color="muted">
            {getLanguageLabel(settings.targetLanguage)}
          </Typography>
        </View>
        <PrimaryButton
          label="Start Conversation"
          onPress={handleStartConversation}
          style={styles.cta}
        />
      </GlassCard>

      <View style={styles.statsRow}>
        <GlassCard style={styles.statCard}>
          <Typography variant="title" color="accent">
            {isLoading ? '—' : recentCount}
          </Typography>
          <Typography variant="caption" color="muted">
            Saved Conversations
          </Typography>
        </GlassCard>
        <GlassCard style={styles.statCard}>
          <Typography variant="title" color="accent">
            {apiReady ? 'ON' : 'OFF'}
          </Typography>
          <Typography variant="caption" color="muted">
            API Connection
          </Typography>
        </GlassCard>
      </View>

      {!apiReady ? (
        <GlassCard style={styles.notice}>
          <Typography variant="body" weight="600">
            Configure your API
          </Typography>
          <Typography variant="caption" color="secondary">
            Add your TalkBridge API base URL in Settings to enable live
            transcription and translation.
          </Typography>
        </GlassCard>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: SPACING.md,
  },
  heroCard: {
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  heroIcon: {
    marginBottom: SPACING.xs,
  },
  heroText: {
    marginBottom: SPACING.sm,
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  cta: {
    marginTop: SPACING.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: SPACING.xs,
  },
  notice: {
    gap: SPACING.xs,
  },
});
