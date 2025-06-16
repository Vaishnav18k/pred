// utils/chatStorage.ts
import { v4 as uuidv4 } from 'uuid';

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type Chat = {
  id: string;
  title: string;
  messages: ChatMessage[];
};

const CHAT_HISTORY_KEY = 'chatHistory';
const CURRENT_CHAT_ID_KEY = 'currentChatId';

// Load all chats
export function loadChats(): Chat[] {
  const saved = localStorage.getItem(CHAT_HISTORY_KEY);
  return saved ? JSON.parse(saved) : [];
}

// Save all chats
export function saveChats(chats: Chat[]) {
  localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(chats));
}

// Load current chat by ID
export function loadCurrentChat(): Chat | null {
  const chats = loadChats();
  const currentChatId = getCurrentChatId();
  return chats.find(chat => chat.id === currentChatId) || null;
}

// Set current chat ID
export function setCurrentChatId(id: string) {
  localStorage.setItem(CURRENT_CHAT_ID_KEY, id);
}

// Get current chat ID
export function getCurrentChatId(): string | null {
  return localStorage.getItem(CURRENT_CHAT_ID_KEY);
}

// Add a new chat
export function addNewChat(title = 'New Chat'): Chat {
  const newChat: Chat = {
    id: uuidv4(),
    title,
    messages: [],
  };

  const chats = loadChats();
  saveChats([newChat, ...chats]);
  setCurrentChatId(newChat.id);

  return newChat;
}

// Update chat messages
export function updateChatMessages(chatId: string, messages: ChatMessage[]) {
  const chats = loadChats();
  const updatedChats = chats.map(chat =>
    chat.id === chatId ? { ...chat, messages } : chat
  );
  saveChats(updatedChats);
}

// Delete chat
export function deleteChat(chatId: string) {
  let chats = loadChats();
  chats = chats.filter(chat => chat.id !== chatId);
  saveChats(chats);

  if (getCurrentChatId() === chatId && chats.length > 0) {
    setCurrentChatId(chats[0].id);
  }
}