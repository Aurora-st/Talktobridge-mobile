import React, { useCallback } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SPACING } from '../constants/layout';
import type { Conversation } from '../types/conversation';
import type { RootStackParamList } from '../types/navigation';
import { Divider } from '../components/common/Divider';
import { GlassCard } from '../components/common/GlassCard';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { Typography } from '../components/common/Typography';
import { HistoryItem } from '../components/history/HistoryItem';
import { useConversations } from '../hooks/useConversations';

type HistoryNavigation = NativeStackNavigationProp<RootStackParamList>;

export function HistoryScreen() {
  const navigation = useNavigation<HistoryNavigation>();
  const { conversations, isLoading, deleteConversation, clearAllConversations } =
    useConversations();

  const handleOpen = useCallback(
    (conversation: Conversation) => {
      navigation.navigate('Conversation', { conversationId: conversation.id });
    },
    [navigation],
  );

  const handleDelete = useCallback(
    (conversation: Conversation) => {
      Alert.alert(
        'Delete Conversation',
        `Remove "${conversation.title}" from your history?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => void deleteConversation(conversation.id),
          },
        ],
      );
    },
    [deleteConversation],
  );

  const handleClearAll = useCallback(() => {
    if (conversations.length === 0) {
      return;
    }

    Alert.alert(
      'Clear All History',
      'This will permanently delete all saved conversations.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => void clearAllConversations(),
        },
      ],
    );
  }, [conversations.length, clearAllConversations]);

  return (
    <ScreenContainer scrollable={false}>
      <View style={styles.header}>
        <Typography variant="title">History</Typography>
        <Typography variant="body" color="secondary">
          Your saved voice translation sessions
        </Typography>
      </View>

      <GlassCard style={styles.listCard} padding={0}>
        {isLoading ? (
          <View style={styles.centered}>
            <Typography variant="body" color="muted">
              Loading conversations…
            </Typography>
          </View>
        ) : conversations.length === 0 ? (
          <View style={styles.centered}>
            <Typography variant="subtitle">No conversations yet</Typography>
            <Typography variant="caption" color="muted" style={styles.emptyHint}>
              Start a new session from the Home screen to build your history.
            </Typography>
          </View>
        ) : (
          <FlatList
            data={conversations}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={styles.itemWrapper}>
                <HistoryItem
                  conversation={item}
                  onPress={() => handleOpen(item)}
                  onDelete={() => handleDelete(item)}
                />
                <Divider />
              </View>
            )}
          />
        )}
      </GlassCard>

      {conversations.length > 0 ? (
        <PrimaryButton
          label="Clear All History"
          variant="danger"
          onPress={handleClearAll}
          style={styles.clearButton}
        />
      ) : null}
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
  clearButton: {
    marginBottom: SPACING.md,
  },
});
