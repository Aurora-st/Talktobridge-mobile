import React, { useState } from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { DEFAULT_API_BASE_URL } from '../constants/config';
import { BORDER_RADIUS, SPACING } from '../constants/layout';
import {
  getValidTargetLanguages,
  isSupportedLanguage,
  SUPPORTED_LANGUAGES,
  type LanguageCode,
} from '../constants/languages';
import type { ThemeMode } from '../types/settings';
import { Divider } from '../components/common/Divider';
import { GlassCard } from '../components/common/GlassCard';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { SettingRow } from '../components/common/SettingRow';
import { Typography } from '../components/common/Typography';
import { fetchHealth } from '../services/api/talkBridgeApi';
import { ApiRequestError } from '../services/api/httpClient';
import { useSettings } from '../hooks/useSettings';
import { useTheme } from '../hooks/useTheme';

const THEME_OPTIONS: { label: string; value: ThemeMode }[] = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

export function SettingsScreen() {
  const { theme, themeMode, setThemeMode } = useTheme();
  const { settings, updateSettings, resetSettings } = useSettings();

  const [apiBaseUrl, setApiBaseUrl] = useState(settings.apiBaseUrl);
  const [isTesting, setIsTesting] = useState(false);

  const handleSaveApi = async () => {
    const trimmedUrl = apiBaseUrl.trim();
    await updateSettings({ apiBaseUrl: trimmedUrl });
    Alert.alert('Saved', 'Backend URL updated successfully.');
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      await updateSettings({ apiBaseUrl: apiBaseUrl.trim() });
      const health = await fetchHealth();
      Alert.alert(
        'Connection Successful',
        `Status: ${health.status}\nWhisper: ${health.whisper_model}\nDatabase: ${health.database ?? 'connected'}`,
      );
    } catch (error) {
      const message =
        error instanceof ApiRequestError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Connection failed.';
      Alert.alert('Connection Failed', message);
    } finally {
      setIsTesting(false);
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Settings',
      'Restore all settings to their default values?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            void resetSettings().then(() => {
              setApiBaseUrl(DEFAULT_API_BASE_URL);
              setThemeMode('system');
            });
          },
        },
      ],
    );
  };

  const handleSourceChange = (code: string) => {
    if (!isSupportedLanguage(code)) {
      return;
    }
    const validTargets = getValidTargetLanguages(code);
    const nextTarget = validTargets.includes(settings.targetLanguage as LanguageCode)
      ? settings.targetLanguage
      : validTargets[0];
    void updateSettings({
      sourceLanguage: code,
      targetLanguage: nextTarget ?? settings.targetLanguage,
    });
  };

  const handleTargetChange = (code: string) => {
    if (!isSupportedLanguage(code)) {
      return;
    }
    void updateSettings({ targetLanguage: code });
  };

  const targetOptions = isSupportedLanguage(settings.sourceLanguage)
    ? getValidTargetLanguages(settings.sourceLanguage)
    : SUPPORTED_LANGUAGES.map((item) => item.code);

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Typography variant="title">Settings</Typography>
        <Typography variant="body" color="secondary">
          Configure your TalkBridge backend connection
        </Typography>
      </View>

      <GlassCard style={styles.section}>
        <Typography variant="label" color="muted">
          Appearance
        </Typography>
        <View style={styles.themeRow}>
          {THEME_OPTIONS.map((option) => {
            const isActive = themeMode === option.value;
            return (
              <PrimaryButton
                key={option.value}
                label={option.label}
                variant={isActive ? 'primary' : 'ghost'}
                onPress={() => setThemeMode(option.value)}
                style={styles.themeButton}
              />
            );
          })}
        </View>
      </GlassCard>

      <GlassCard style={styles.section}>
        <Typography variant="label" color="muted">
          Backend Configuration
        </Typography>
        <Typography variant="caption" color="secondary">
          FastAPI backend URL. Use {DEFAULT_API_BASE_URL} for{' '}
          {Platform.OS === 'android' ? 'Android emulator' : 'local development'}.
        </Typography>
        <TextInput
          value={apiBaseUrl}
          onChangeText={setApiBaseUrl}
          placeholder={DEFAULT_API_BASE_URL}
          placeholderTextColor={theme.colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          style={[
            styles.input,
            {
              color: theme.colors.textPrimary,
              backgroundColor: theme.colors.inputBackground,
              borderColor: theme.colors.glassBorder,
            },
          ]}
        />
        <PrimaryButton label="Save Backend URL" onPress={handleSaveApi} />
        <PrimaryButton
          label="Test Connection"
          variant="ghost"
          loading={isTesting}
          onPress={handleTestConnection}
        />
      </GlassCard>

      <GlassCard style={styles.section}>
        <Typography variant="label" color="muted">
          Default Languages
        </Typography>
        <SettingRow
          title="Source Language"
          description={
            SUPPORTED_LANGUAGES.find((item) => item.code === settings.sourceLanguage)?.label
          }
        />
        <View style={styles.languagePicker}>
          {SUPPORTED_LANGUAGES.map((language) => (
            <PrimaryButton
              key={`source-${language.code}`}
              label={language.code.toUpperCase()}
              variant={settings.sourceLanguage === language.code ? 'primary' : 'ghost'}
              onPress={() => handleSourceChange(language.code)}
              style={styles.langChip}
            />
          ))}
        </View>
        <Divider />
        <SettingRow
          title="Target Language"
          description={
            SUPPORTED_LANGUAGES.find((item) => item.code === settings.targetLanguage)?.label
          }
        />
        <View style={styles.languagePicker}>
          {SUPPORTED_LANGUAGES.filter((language) =>
            targetOptions.includes(language.code),
          ).map((language) => (
            <PrimaryButton
              key={`target-${language.code}`}
              label={language.code.toUpperCase()}
              variant={settings.targetLanguage === language.code ? 'primary' : 'ghost'}
              onPress={() => handleTargetChange(language.code)}
              style={styles.langChip}
            />
          ))}
        </View>
      </GlassCard>

      <GlassCard style={styles.section}>
        <Typography variant="label" color="muted">
          Preferences
        </Typography>
        <SettingRow
          title="Haptic Feedback"
          description="Vibrate on record start and stop"
          value={settings.hapticFeedback}
          onValueChange={(value) => void updateSettings({ hapticFeedback: value })}
        />
        <Divider />
        <SettingRow
          title="Auto-play Responses"
          description="Automatically play translated speech from audio_url"
          value={settings.autoPlayResponses}
          onValueChange={(value) => void updateSettings({ autoPlayResponses: value })}
        />
      </GlassCard>

      <PrimaryButton
        label="Reset All Settings"
        variant="danger"
        onPress={handleReset}
        style={styles.resetButton}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: SPACING.lg,
    gap: SPACING.xs,
  },
  section: {
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  themeRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  themeButton: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: 16,
  },
  languagePicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  langChip: {
    minWidth: 56,
  },
  resetButton: {
    marginBottom: SPACING.xl,
  },
});
