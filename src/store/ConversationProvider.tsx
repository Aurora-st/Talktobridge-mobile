import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Conversation, CreateConversationInput } from '../types/conversation';
import {
  appendMessage as appendMessageToStorage,
  clearAllConversations as clearAllFromStorage,
  createConversation as createConversationInStorage,
  deleteConversation as deleteConversationFromStorage,
  getConversationById,
  getConversations,
} from '../services/storage/conversationRepository';

interface ConversationContextValue {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  isLoading: boolean;
  refreshConversations: () => Promise<void>;
  loadConversation: (id: string) => Promise<Conversation | null>;
  createConversation: (input: CreateConversationInput) => Promise<Conversation>;
  appendMessage: (
    conversationId: string,
    role: 'user' | 'assistant',
    text: string,
    audioUri: string | null,
    sourceLanguage: string,
    targetLanguage: string,
  ) => Promise<Conversation>;
  deleteConversation: (id: string) => Promise<void>;
  clearAllConversations: () => Promise<void>;
  setActiveConversation: (conversation: Conversation | null) => void;
}

export const ConversationContext = createContext<ConversationContextValue | null>(null);

interface ConversationProviderProps {
  children: ReactNode;
}

export function ConversationProvider({ children }: ConversationProviderProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshConversations = useCallback(async () => {
    const data = await getConversations();
    setConversations(data);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        const data = await getConversations();
        if (mounted) {
          setConversations(data);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void bootstrap();
    return () => {
      mounted = false;
    };
  }, []);

  const loadConversation = useCallback(async (id: string) => {
    const conversation = await getConversationById(id);
    if (conversation) {
      setActiveConversation(conversation);
    }
    return conversation;
  }, []);

  const createConversation = useCallback(async (input: CreateConversationInput) => {
    const conversation = await createConversationInStorage(input);
    await refreshConversations();
    setActiveConversation(conversation);
    return conversation;
  }, [refreshConversations]);

  const appendMessage = useCallback(
    async (
      conversationId: string,
      role: 'user' | 'assistant',
      text: string,
      audioUri: string | null,
      sourceLanguage: string,
      targetLanguage: string,
    ) => {
      const updated = await appendMessageToStorage({
        conversationId,
        role,
        text,
        audioUri,
        sourceLanguage,
        targetLanguage,
      });
      setActiveConversation(updated);
      await refreshConversations();
      return updated;
    },
    [refreshConversations],
  );

  const deleteConversation = useCallback(
    async (id: string) => {
      await deleteConversationFromStorage(id);
      setActiveConversation((current) => (current?.id === id ? null : current));
      await refreshConversations();
    },
    [refreshConversations],
  );

  const clearAllConversations = useCallback(async () => {
    await clearAllFromStorage();
    setActiveConversation(null);
    await refreshConversations();
  }, [refreshConversations]);

  const value = useMemo(
    () => ({
      conversations,
      activeConversation,
      isLoading,
      refreshConversations,
      loadConversation,
      createConversation,
      appendMessage,
      deleteConversation,
      clearAllConversations,
      setActiveConversation,
    }),
    [
      conversations,
      activeConversation,
      isLoading,
      refreshConversations,
      loadConversation,
      createConversation,
      appendMessage,
      deleteConversation,
      clearAllConversations,
    ],
  );

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
}
