import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from '../../utils/date';
import { getLanguageLabel } from '../../constants/languages';
import { SPACING } from '../../constants/layout';
import type { Conversation } from '../../types/conversation';
import { useTheme } from '../../hooks/useTheme';
import { Typography } from '../common/Typography';

interface HistoryItemProps {
  conversation: Conversation;
  onPress: () => void;
  onDelete: () => void;
}

export function HistoryItem({ conversation, onPress, onDelete }: HistoryItemProps) {
  const { theme } = useTheme();
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  const preview = lastMessage?.text ?? 'No messages yet';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: pressed
            ? theme.colors.inputBackground
            : 'transparent',
        },
      ]}
    >
      <View style={styles.content}>
        <Typography variant="body" weight="600" numberOfLines={1}>
          {conversation.title}
        </Typography>
        <Typography variant="caption" color="muted" numberOfLines={1}>
          {getLanguageLabel(conversation.sourceLanguage)} →{' '}
          {getLanguageLabel(conversation.targetLanguage)}
        </Typography>
        <Typography variant="caption" color="secondary" numberOfLines={2}>
          {preview}
        </Typography>
        <Typography variant="caption" color="muted">
          {formatDistanceToNow(conversation.updatedAt)}
        </Typography>
      </View>
      <Pressable onPress={onDelete} hitSlop={12} style={styles.delete}>
        <Ionicons name="trash-outline" size={20} color={theme.colors.danger} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  content: {
    flex: 1,
    gap: SPACING.xs,
  },
  delete: {
    padding: SPACING.sm,
  },
});
