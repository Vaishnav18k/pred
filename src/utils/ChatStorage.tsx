// // utils/chatStorage.ts
// import { v4 as uuidv4 } from 'uuid';

// export type ChatMessage = {
//   role: 'user' | 'assistant';
//   content: string;
// };

// export type Chat = {
//   id: string;
//   title: string;
//   messages: ChatMessage[];
// };

// const CHAT_HISTORY_KEY = 'chatHistory';
// const CURRENT_CHAT_ID_KEY = 'currentChatId';

// // Load all chats
// export function loadChats(): Chat[] {
//   const saved = localStorage.getItem(CHAT_HISTORY_KEY);
//   return saved ? JSON.parse(saved) : [];
// }

// // Save all chats
// export function saveChats(chats: Chat[]) {
//   localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(chats));
// }

// // Load current chat by ID
// export function loadCurrentChat(): Chat | null {
//   const chats = loadChats();
//   const currentChatId = getCurrentChatId();
//   return chats.find(chat => chat.id === currentChatId) || null;
// }

// // Set current chat ID
// export function setCurrentChatId(id: string) {
//   localStorage.setItem(CURRENT_CHAT_ID_KEY, id);
// }

// // Get current chat ID
// export function getCurrentChatId(): string | null {
//   return localStorage.getItem(CURRENT_CHAT_ID_KEY);
// }

// // Add a new chat
// export function addNewChat(title = 'New Chat'): Chat {
//   const newChat: Chat = {
//     id: uuidv4(),
//     title,
//     messages: [],
//   };

//   const chats = loadChats();
//   saveChats([newChat, ...chats]);
//   setCurrentChatId(newChat.id);

//   return newChat;
// }

// // Update chat messages
// export function updateChatMessages(chatId: string, messages: ChatMessage[]) {
//   const chats = loadChats();
//   const updatedChats = chats.map(chat =>
//     chat.id === chatId ? { ...chat, messages } : chat
//   );
//   saveChats(updatedChats);
// }

// // Delete chat
// export function deleteChat(chatId: string) {
//   let chats = loadChats();
//   chats = chats.filter(chat => chat.id !== chatId);
//   saveChats(chats);

//   if (getCurrentChatId() === chatId && chats.length > 0) {
//     setCurrentChatId(chats[0].id);
//   }
// }


// import { supabase } from './supabaseClient';
// import { v4 as uuidv4 } from 'uuid';

// // Types for chat data
// export type ChatMessage = {
//   role: 'user' | 'assistant';
//   content: string;
// };

// export type Chat = {
//   id: string;
//   title: string;
//   messages: ChatMessage[];
// };

// // Function to get user ID from Stack Auth (adjust based on your setup)
// const getUserId = () => {
//   // Replace this with actual Stack Auth user ID retrieval logic
//   // For example, if using useUser from @stackframe/stack:
//   // const { user } = useUser(); return user?.id;
//   return localStorage.getItem('stack_user_id') || 'anonymous-user';
// };

// // Load all chats for the current user
// export async function loadChats(): Promise<Chat[]> {
  
//   const userId = getUserId();
//   const { data, error } = await supabase
//     .from('chats')
//     .select('id, title')
//     .eq('user_id', userId)
//     .order('created_at', { ascending: false });

//   if (error) {
//     console.error('Error loading chats:', error);
//     return [];
//   }

//   return (data || []).map(chat => ({ ...chat, messages: [] }));
// }

// // Load current chat with messages
// export async function loadCurrentChat(): Promise<Chat | null> {


  
//   const currentChatId = getCurrentChatId();
//   if (!currentChatId) return null;

//   const userId = getUserId();
//   const { data: chatData, error } = await supabase
//     .from('chats')
//     .select('id, title')
//     .eq('id', currentChatId)
//     .eq('user_id', userId)
//     .single();

//   if (error || !chatData) {
//     console.error('Error loading current chat:', error);
//     return null;
//   }

//   const { data: messagesData, error: messagesError } = await supabase
//     .from('messages')
//     .select('role, content')
//     .eq('chat_id', currentChatId)
//     .order('created_at', { ascending: true });

//   if (messagesError) {
//     console.error('Error loading messages:', messagesError);
//     return { ...chatData, messages: [] };
//   }

//   return { ...chatData, messages: messagesData || [] };
// }

// // Set current chat ID (still using localStorage for simplicity)
// export function setCurrentChatId(id: string) {
//   localStorage.setItem('currentChatId', id);
// }

// // Get current chat ID
// export function getCurrentChatId(): string | null {
//   return localStorage.getItem('currentChatId');
// }

// // Add a new chat
// export async function addNewChat(title = 'New Chat'): Promise<Chat> {
//   const userId = getUserId();
//   const newChat = {
//     id: uuidv4(),
//     title,
//     user_id: userId,
//   };

//   const { data, error } = await supabase
//     .from('chats')
//     .insert([newChat])
//     .select('id, title')
//     .single();

//   if (error) {
//     console.error('Error creating new chat:', error);
//     throw error;
//   }

//   setCurrentChatId(newChat.id);
//   return { ...data, messages: [] };
// }

// // Update chat messages
// export async function updateChatMessages(chatId: string, messages: ChatMessage[]) {
//   // Fetch existing messages to avoid overwriting - optional based on your logic
//   const lastMessage = messages[messages.length - 1];
//   const { data, error } = await supabase
//     .from('messages')
//     .insert([{ chat_id: chatId, role: lastMessage.role, content: lastMessage.content }]);

//   if (error) {
//     console.error('Error updating messages:', error);
//     throw error;
//   }
// }

// // Delete a chat
// export async function deleteChat(chatId: string) {
//   const userId = getUserId();
//   const { error } = await supabase
//     .from('chats')
//     .delete()
//     .eq('id', chatId)
//     .eq('user_id', userId);

//   if (error) {
//     console.error('Error deleting chat:', error);
//     throw error;
//   }

//   const currentChatId = getCurrentChatId();
//   if (currentChatId === chatId) {
//     const { data: remainingChats } = await supabase
//       .from('chats')
//       .select('id')
//       .eq('user_id', userId)
//       .limit(1);

//     if (remainingChats && remainingChats.length > 0) {
//       setCurrentChatId(remainingChats[0].id);
//     } else {
//       setCurrentChatId('');
//     }
//   }
// }

//newly updated code
import { supabase } from '@/utils/supabaseclient';
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

// Function to get user ID from Stack Auth (adjust based on your setup)
const getUserId = () => {
  // This is a placeholder. Replace with actual Stack Auth user ID retrieval.
  // For example, if using useUser from @stackframe/stack in components,
  // you may need to pass the user ID or store it in localStorage after login.
  return localStorage.getItem('stack_user_id') || 'anonymous-user';
};

// Load all chats for the current user
export async function loadChats(): Promise<Chat[]> {
  const userId = getUserId();
  const { data, error } = await supabase
    .from('chats')
    .select('id, title')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading chats:', error);
    return [];
  }

  return (data || []).map(chat => ({ ...chat, messages: [] }));
}

// Load current chat with messages
export async function loadCurrentChat(): Promise<Chat | null> {
  const currentChatId = getCurrentChatId();
  if (!currentChatId) return null;

  const userId = getUserId();
  const { data: chatData, error } = await supabase
    .from('chats')
    .select('id, title')
    .eq('id', currentChatId)
    .eq('user_id', userId)
    .single();

  if (error || !chatData) {
    console.error('Error loading current chat:', error);
    return null;
  }

  const { data: messagesData, error: messagesError } = await supabase
    .from('messages')
    .select('role, content')
    .eq('chat_id', currentChatId)
    .order('created_at', { ascending: true });

  if (messagesError) {
    console.error('Error loading messages:', messagesError);
    return { ...chatData, messages: [] };
  }

  return { ...chatData, messages: messagesData || [] };
}

// Set current chat ID (still using localStorage for simplicity)
export function setCurrentChatId(id: string) {
  localStorage.setItem('currentChatId', id);
}

// Get current chat ID
export function getCurrentChatId(): string | null {
  return localStorage.getItem('currentChatId');
}

// Add a new chat
export async function addNewChat(title = 'New Chat'): Promise<Chat> {
  const userId = getUserId();
  const newChat = {
    id: uuidv4(),
    title,
    user_id: userId,
  };

  const { data, error } = await supabase
    .from('chats')
    .insert([newChat])
    .select('id, title')
    .single();

  if (error) {
    console.error('Error creating new chat:', error);
    throw error;
  }

  setCurrentChatId(newChat.id);
  return { ...data, messages: [] };
}

// Update chat messages
export async function updateChatMessages(chatId: string, messages: ChatMessage[]) {
  // Since messages are additive, insert only the latest message to avoid duplicates
  const lastMessage = messages[messages.length - 1];
  const { data, error } = await supabase
    .from('messages')
    .insert([{ chat_id: chatId, role: lastMessage.role, content: lastMessage.content }]);

  if (error) {
    console.error('Error updating messages:', error);
    throw error;
  }
}

// Delete a chat
export async function deleteChat(chatId: string) {
  const userId = getUserId();
  const { error } = await supabase
    .from('chats')
    .delete()
    .eq('id', chatId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting chat:', error);
    throw error;
  }

  const currentChatId = getCurrentChatId();
  if (currentChatId === chatId) {
    const { data: remainingChats } = await supabase
      .from('chats')
      .select('id')
      .eq('user_id', userId)
      .limit(1);

    if (remainingChats && remainingChats.length > 0) {
      setCurrentChatId(remainingChats[0].id);
    } else {
      setCurrentChatId('');
    }
  }
}