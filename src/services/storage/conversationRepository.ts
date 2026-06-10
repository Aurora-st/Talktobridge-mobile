import type {
  AppendMessageInput,
  Conversation,
  CreateConversationInput,
} from '../../types/conversation';
import { MAX_CONVERSATION_TITLE_LENGTH } from '../../constants/config';
import { STORAGE_KEYS } from './storageKeys';
import { getItem, setItem } from './asyncStorageService';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function buildTitle(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) {
    return 'New Conversation';
  }
  return trimmed.length > MAX_CONVERSATION_TITLE_LENGTH
    ? `${trimmed.slice(0, MAX_CONVERSATION_TITLE_LENGTH)}…`
    : trimmed;
}

async function readAll(): Promise<Conversation[]> {
  const conversations = await getItem<Conversation[]>(STORAGE_KEYS.CONVERSATIONS);
  return conversations ?? [];
}

async function writeAll(conversations: Conversation[]): Promise<void> {
  const sorted = [...conversations].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
  await setItem(STORAGE_KEYS.CONVERSATIONS, sorted);
}

export async function getConversations(): Promise<Conversation[]> {
  return readAll();
}

export async function getConversationById(id: string): Promise<Conversation | null> {
  const conversations = await readAll();
  return conversations.find((conversation) => conversation.id === id) ?? null;
}

export async function createConversation(
  input: CreateConversationInput,
): Promise<Conversation> {
  const now = new Date().toISOString();
  const conversation: Conversation = {
    id: generateId(),
    title: input.title ?? 'New Conversation',
    sourceLanguage: input.sourceLanguage,
    targetLanguage: input.targetLanguage,
    messages: [],
    createdAt: now,
    updatedAt: now,
  };

  const conversations = await readAll();
  conversations.unshift(conversation);
  await writeAll(conversations);
  return conversation;
}

export async function appendMessage(input: AppendMessageInput): Promise<Conversation> {
  const conversations = await readAll();
  const index = conversations.findIndex((item) => item.id === input.conversationId);

  if (index === -1) {
    throw new Error(`Conversation not found: ${input.conversationId}`);
  }

  const now = new Date().toISOString();
  const message = {
    id: generateId(),
    role: input.role,
    text: input.text,
    audioUri: input.audioUri,
    sourceLanguage: input.sourceLanguage,
    targetLanguage: input.targetLanguage,
    createdAt: now,
  };

  const existing = conversations[index];
  if (!existing) {
    throw new Error(`Conversation not found: ${input.conversationId}`);
  }

  const updated: Conversation = {
    ...existing,
    title:
      existing.messages.length === 0 && input.role === 'user'
        ? buildTitle(input.text)
        : existing.title,
    messages: [...existing.messages, message],
    updatedAt: now,
  };

  conversations[index] = updated;
  await writeAll(conversations);
  return updated;
}

export async function deleteConversation(id: string): Promise<void> {
  const conversations = await readAll();
  const filtered = conversations.filter((conversation) => conversation.id !== id);
  await writeAll(filtered);
}

export async function clearAllConversations(): Promise<void> {
  await writeAll([]);
}
