import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BORDER_RADIUS, SPACING } from '../../constants/layout';
import type { ConversationMessage } from '../../types/conversation';
import { useTheme } from '../../hooks/useTheme';
import { Typography } from '../common/Typography';

interface MessageBubbleProps {
  message: ConversationMessage;
  onPlayAudio?: (uri: string) => void;
}

export function MessageBubble({ message, onPlayAudio }: MessageBubbleProps) {
  const { theme } = useTheme();
  const isUser = message.role === 'user';

  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowAssistant]}>
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: isUser
              ? theme.colors.accent
              : theme.colors.glassBackground,
            borderColor: isUser
              ? 'transparent'
              : theme.colors.glassBorder,
          },
        ]}
      >
        <Typography
          variant="body"
          style={{ color: isUser ? '#FFFFFF' : theme.colors.textPrimary }}
        >
          {message.text}
        </Typography>
        {message.audioUri && onPlayAudio ? (
          <Pressable
            onPress={() => onPlayAudio(message.audioUri!)}
            style={[
              styles.playButton,
              {
                backgroundColor: isUser
                  ? 'rgba(255,255,255,0.2)'
                  : theme.colors.inputBackground,
              },
            ]}
          >
            <Ionicons
              name="play"
              size={14}
              color={isUser ? '#FFFFFF' : theme.colors.accent}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginBottom: SPACING.sm,
    flexDirection: 'row',
  },
  rowUser: {
    justifyContent: 'flex-end',
  },
  rowAssistant: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '82%',
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  playButton: {
    alignSelf: 'flex-start',
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
