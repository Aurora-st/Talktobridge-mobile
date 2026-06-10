import React from 'react';
import { StyleSheet, View } from 'react-native';
import { formatDistanceToNow } from '../../utils/date';
import { getLanguageLabel } from '../../constants/languages';
import { SPACING } from '../../constants/layout';
import type { AnalyticsHistoryRecord } from '../../types/api';
import { Typography } from '../common/Typography';

interface HistoryItemProps {
  record: AnalyticsHistoryRecord;
}

export function HistoryItem({ record }: HistoryItemProps) {
  const sourceLabel = record.source_lang
    ? getLanguageLabel(record.source_lang)
    : record.detected_language
      ? `${getLanguageLabel(record.detected_language)} (detected)`
      : 'Auto';

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Typography variant="body" weight="600" numberOfLines={1}>
          {record.source_text || 'Voice translation'}
        </Typography>
        <Typography variant="caption" color="muted">
          {sourceLabel} → {getLanguageLabel(record.target_lang)}
        </Typography>
        <Typography variant="caption" color="secondary" numberOfLines={2}>
          {record.translated_text}
        </Typography>
        <View style={styles.metaRow}>
          <Typography variant="caption" color="muted">
            {formatDistanceToNow(record.created_at)}
          </Typography>
          <Typography variant="caption" color="muted">
            {Math.round(record.latency.total)}ms
          </Typography>
          {record.cached ? (
            <Typography variant="caption" color="accent">
              Cached
            </Typography>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.md,
  },
  content: {
    gap: SPACING.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
});
