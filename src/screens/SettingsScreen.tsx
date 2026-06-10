import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { BORDER_RADIUS, SPACING } from '../constants/layout';
import { SUPPORTED_LANGUAGES } from '../constants/languages';
import type { ThemeMode } from '../types/settings';
import { Divider } from '../components/common/Divider';
import { GlassCard } from '../components/common/GlassCard';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { SettingRow } from '../components/common/SettingRow';
import { Typography } from '../components/common/Typography';
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
  const [apiKey, setApiKey] = useState(settings.apiKey);

  const handleSaveApi = async () => {
    await updateSettings({ apiBaseUrl: apiBaseUrl.trim(), apiKey: apiKey.trim() });
    Alert.alert('Saved', 'API configuration updated successfully.');
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
              setApiBaseUrl('');
              setApiKey('');
              setThemeMode('system');
            });
          },
        },
      ],
    );
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Typography variant="title">Settings</Typography>
        <Typography variant="body" color="secondary">
          Customize your TalkBridge experience
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
          API Configuration
        </Typography>
        <Typography variant="caption" color="secondary">
          Enter your TalkBridge backend URL and API key for live translation.
        </Typography>
        <TextInput
          value={apiBaseUrl}
          onChangeText={setApiBaseUrl}
          placeholder="https://api.your-backend.com"
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
        <TextInput
          value={apiKey}
          onChangeText={setApiKey}
          placeholder="API Key"
          placeholderTextColor={theme.colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          style={[
            styles.input,
            {
              color: theme.colors.textPrimary,
              backgroundColor: theme.colors.inputBackground,
              borderColor: theme.colors.glassBorder,
            },
          ]}
        />
        <PrimaryButton label="Save API Settings" onPress={handleSaveApi} />
      </GlassCard>

      <GlassCard style={styles.section}>
        <Typography variant="label" color="muted">
          Default Languages
        </Typography>
        <SettingRow
          title="Source Language"
          description={SUPPORTED_LANGUAGES.find((l) => l.code === settings.sourceLanguage)?.label}
          trailing={
            <Typography variant="caption" color="accent">
              {settings.sourceLanguage.toUpperCase()}
            </Typography>
          }
        />
        <Divider />
        <View style={styles.languagePicker}>
          {SUPPORTED_LANGUAGES.slice(0, 6).map((language) => (
            <PrimaryButton
              key={`source-${language.code}`}
              label={language.code.toUpperCase()}
              variant={settings.sourceLanguage === language.code ? 'primary' : 'ghost'}
              onPress={() => void updateSettings({ sourceLanguage: language.code })}
              style={styles.langChip}
            />
          ))}
        </View>
        <Divider />
        <SettingRow
          title="Target Language"
          description={SUPPORTED_LANGUAGES.find((l) => l.code === settings.targetLanguage)?.label}
          trailing={
            <Typography variant="caption" color="accent">
              {settings.targetLanguage.toUpperCase()}
            </Typography>
          }
        />
        <View style={styles.languagePicker}>
          {SUPPORTED_LANGUAGES.slice(0, 6).map((language) => (
            <PrimaryButton
              key={`target-${language.code}`}
              label={language.code.toUpperCase()}
              variant={settings.targetLanguage === language.code ? 'primary' : 'ghost'}
              onPress={() => void updateSettings({ targetLanguage: language.code })}
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
          description="Automatically play translated speech"
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
