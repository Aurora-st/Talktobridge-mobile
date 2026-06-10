import React from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { SPACING } from '../constants/layout';
import { Divider } from '../components/common/Divider';
import { GlassCard } from '../components/common/GlassCard';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { Typography } from '../components/common/Typography';
import { HistoryItem } from '../components/history/HistoryItem';
import { useAnalyticsHistory } from '../hooks/useAnalyticsHistory';
import { useTheme } from '../hooks/useTheme';

export function HistoryScreen() {
  const { theme } = useTheme();
  const { history, isLoading, error, refresh } = useAnalyticsHistory(50);

  return (
    <ScreenContainer scrollable={false}>
      <View style={styles.header}>
        <Typography variant="title">History</Typography>
        <Typography variant="body" color="secondary">
          Translation records from your FastAPI backend
        </Typography>
      </View>

      <GlassCard style={styles.listCard} padding={0}>
        {isLoading && history.length === 0 ? (
          <View style={styles.centered}>
            <Typography variant="body" color="muted">
              Loading translation history…
            </Typography>
          </View>
        ) : error && history.length === 0 ? (
          <View style={styles.centered}>
            <Typography variant="subtitle">Unable to load history</Typography>
            <Typography variant="caption" color="muted" style={styles.emptyHint}>
              {error}
            </Typography>
            <PrimaryButton
              label="Retry"
              variant="ghost"
              onPress={() => void refresh()}
              style={styles.retryButton}
            />
          </View>
        ) : history.length === 0 ? (
          <View style={styles.centered}>
            <Typography variant="subtitle">No translations yet</Typography>
            <Typography variant="caption" color="muted" style={styles.emptyHint}>
              Complete a voice session from the Home screen to populate backend
              history.
            </Typography>
          </View>
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={() => void refresh()}
                tintColor={theme.colors.accent}
              />
            }
            renderItem={({ item }) => (
              <View style={styles.itemWrapper}>
                <HistoryItem record={item} />
                <Divider />
              </View>
            )}
          />
        )}
      </GlassCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: SPACING.lg,
    gap: SPACING.xs,
  },
  listCard: {
    flex: 1,
    marginBottom: SPACING.md,
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  itemWrapper: {
    width: '100%',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    gap: SPACING.sm,
    minHeight: 240,
  },
  emptyHint: {
    textAlign: 'center',
  },
  retryButton: {
    marginTop: SPACING.sm,
    minWidth: 120,
  },
});
