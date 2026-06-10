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
import { useBackendStatus } from '../hooks/useBackendStatus';
import { useSettings } from '../hooks/useSettings';
import { useTheme } from '../hooks/useTheme';

type HomeNavigation = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<HomeNavigation>();
  const { theme } = useTheme();
  const { settings } = useSettings();
  const { health, stats, isLoading, error, isOnline, refresh } = useBackendStatus();

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
            { backgroundColor: isOnline ? theme.colors.success : theme.colors.danger },
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
          transcription, translation, and speech synthesis via your FastAPI
          backend.
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
            {isLoading ? '—' : (stats?.total_translations ?? 0)}
          </Typography>
          <Typography variant="caption" color="muted">
            Total Translations
          </Typography>
        </GlassCard>
        <GlassCard style={styles.statCard}>
          <Typography variant="title" color="accent">
            {isLoading ? '—' : `${Math.round(stats?.success_rate_percent ?? 0)}%`}
          </Typography>
          <Typography variant="caption" color="muted">
            Success Rate
          </Typography>
        </GlassCard>
      </View>

      <GlassCard style={styles.notice}>
        <Typography variant="body" weight="600">
          Backend {isOnline ? 'Connected' : 'Offline'}
        </Typography>
        {isOnline && health ? (
          <Typography variant="caption" color="secondary">
            Whisper model: {health.whisper_model} · Cache entries:{' '}
            {health.cache_entries} · Database: {health.database ?? 'connected'}
          </Typography>
        ) : (
          <Typography variant="caption" color="secondary">
            {error ??
              'Unable to reach the backend. Verify it is running at the configured URL.'}
          </Typography>
        )}
        <PrimaryButton
          label="Refresh Status"
          variant="ghost"
          onPress={() => void refresh()}
          style={styles.refreshButton}
        />
      </GlassCard>
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
  refreshButton: {
    marginTop: SPACING.sm,
  },
});
