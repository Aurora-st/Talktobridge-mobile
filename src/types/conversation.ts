export type MessageRole = 'user' | 'assistant';

export interface ConversationMessage {
  id: string;
  role: MessageRole;
  text: string;
  audioUri: string | null;
  sourceLanguage: string;
  targetLanguage: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  sourceLanguage: string;
  targetLanguage: string;
  messages: ConversationMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateConversationInput {
  sourceLanguage: string;
  targetLanguage: string;
  title?: string;
}

export interface AppendMessageInput {
  conversationId: string;
  role: MessageRole;
  text: string;
  audioUri: string | null;
  sourceLanguage: string;
  targetLanguage: string;
}
