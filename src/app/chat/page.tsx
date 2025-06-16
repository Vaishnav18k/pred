
// // app/chat/page.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import Sidebar from '@/components/Sidebar';
// import MessageList from '@/components/MessageList';
// import InputBox from '@/components/InputBox';
// import { UserButton } from '@stackframe/stack';
// import {
//   loadChats,
//   loadCurrentChat,
//   addNewChat,
//   updateChatMessages,
//   setCurrentChatId,
//   deleteChat,
// } from '@/utils/ChatStorage';

// export default function ChatPage() {
//   const [chats, setChats] = useState<Array<{id: string, title: string, messages: any[]}>>([]);
//   const [currentChat, setCurrentChat] = useState<{id: string, title: string, messages: any[]} | null>(null);
//   const [input, setInput] = useState('');
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [selectedModel, setSelectedModel] = useState('gemma2-9b-it');

//   // Load initial chats and current chat
//   useEffect(() => {
//     const savedChats = loadChats();
//     setChats(savedChats);

//     const chat = loadCurrentChat();
//     if (chat) {
//       setCurrentChat(chat);
//     } else {
//       handleNewChat();
//     }
//   }, []);

//   const handleSendMessage = async () => {
//     if (!input.trim() || !currentChat) return;

//     const userMessage = input.trim();
//     setInput('');

//     // Update local state immediately
//     const updatedMessages = [
//       ...(currentChat.messages || []),
//       { role: 'user', content: userMessage },
//     ];
    
//     const updatedChat = {
//       ...currentChat,
//       messages: updatedMessages
//     };
    
//     setCurrentChat(updatedChat);
//     updateChatMessages(currentChat.id, updatedMessages);

//     try {
//       const response = await fetch('/api/chat', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ prompt: userMessage, modelId: selectedModel }),
//       });

//       if (!response.ok || !response.body) {
//         throw new Error('Failed to get response from AI');
//       }

//       const reader = response.body.getReader();
//       const decoder = new TextDecoder();
//       let aiResponse = '';

//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;
        
//         const chunk = decoder.decode(value, { stream: true });
//         aiResponse += chunk;

//         // Update incrementally as we receive chunks
//         const assistantMessage = [
//           ...updatedMessages,
//           { role: 'assistant', content: aiResponse },
//         ];

//         const streamingChat = {
//           ...currentChat,
//           messages: assistantMessage
//         };
        
//         setCurrentChat(streamingChat);
//         updateChatMessages(currentChat.id, assistantMessage);
//       }
//     } catch (error) {
//       console.error('Error sending message:', error);
//       const errorMessage = [
//         ...updatedMessages,
//         { role: 'assistant', content: "I'm sorry, something went wrong." },
//       ];
      
//       const errorChat = {
//         ...currentChat,
//         messages: errorMessage
//       };
      
//       setCurrentChat(errorChat);
//       updateChatMessages(currentChat.id, errorMessage);
//     }
//   };

//   const handleNewChat = () => {
//     const newChat = addNewChat('New Chat');
//     setCurrentChat(newChat);
//     setCurrentChatId(newChat.id);
//     setChats(loadChats());
//   };

//   const handleSelectChat = (chatId: string) => {
//     const chat = chats.find(c => c.id === chatId);
//     if (chat) {
//       setCurrentChat(chat);
//       setCurrentChatId(chatId);
//     }
//     setIsSidebarOpen(false); // Close sidebar on mobile
//   };

//   return (
//     <div className="flex h-screen">
//       <Sidebar
//         isOpen={isSidebarOpen}
//         onClose={() => setIsSidebarOpen(false)}
//         onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
//         selectedModel={selectedModel}
//         onSelectModel={setSelectedModel}
//         currentChatId={currentChat?.id}
//         chats={chats}
//         onSelectChat={handleSelectChat}
//         onNewChat={handleNewChat}
//       />
      
//       <div className="flex flex-col flex-1 overflow-hidden bg-gray-900 text-white">
//         <header className="p-4 border-b border-gray-700 flex justify-between items-center">
//           <h1 className="text-xl font-semibold">
//             {currentChat?.title || 'New Chat'}
//           </h1>
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//               className="p-2 rounded hover:bg-gray-700"
//             >
//               {isSidebarOpen ? <PanelLeftCloseIcon /> : <PanelLeftIcon />}
//             </button>
//             <UserButton />
//           </div>
//         </header>
        
//         <MessageList messages={currentChat?.messages || []} />
        
//         <InputBox
//           input={input}
//           setInput={setInput}
//           onSend={handleSendMessage}
//           isSidebarOpen={isSidebarOpen}
//         />
//       </div>
//     </div>
//   );
// }

// function PanelLeftCloseIcon() {
//   return (
//     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <rect width="18" height="18" x="3" y="3" rx="2" />
//       <line x1="15" y1="3" x2="15" y2="21" />
//     </svg>
//   );
// }

// function PanelLeftIcon() {
//   return (
//     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <rect width="18" height="18" x="3" y="3" rx="2" />
//       <line x1="9" y1="3" x2="9" y2="21" />
//     </svg>
//   );
// }

// app/chat/page.tsx
'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import MessageList from '@/components/MessageList';
import InputBox from '@/components/InputBox';
import { UserButton } from '@stackframe/stack';
import { deleteChat } from '@/utils/ChatStorage';
import {
  loadChats,
  loadCurrentChat,
  addNewChat,
  updateChatMessages,
  setCurrentChatId,
} from '@/utils/ChatStorage';

export default function ChatPage() {
  const [chats, setChats] = useState<Array<{id: string, title: string, messages: any[]}>>([]);
  const [currentChat, setCurrentChat] = useState<{id: string, title: string, messages: any[]} | null>(null);
  const [input, setInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedModel, setSelectedModel] = useState('gemma2-9b-it');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const handleDeleteChat = (chatId: string) => {
    deleteChat(chatId);
    const updatedChats = chats.filter(chat => chat.id !== chatId);
    setChats(updatedChats);
    
    if (currentChat?.id === chatId) {
      if (updatedChats.length > 0) {
        setCurrentChat(updatedChats[0]);
        setCurrentChatId(updatedChats[0].id);
      } else {
        const newChat = addNewChat();
        setCurrentChat(newChat);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !currentChat) return;

    const userMessage = input.trim();
    setInput('');

    // Update local state immediately
    const updatedMessages = [
      ...(currentChat.messages || []),
      { role: 'user', content: userMessage },
    ];

    const updatedChat = {
      ...currentChat,
      messages: updatedMessages,
    };

    setCurrentChat(updatedChat);
    updateChatMessages(currentChat.id, updatedMessages);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage, modelId: selectedModel }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to get response from AI');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        aiResponse += chunk;

        // Update incrementally as we receive chunks
        const assistantMessage = [
          ...updatedMessages,
          { role: 'assistant', content: aiResponse },
        ];

        const streamingChat = {
          ...currentChat,
          messages: assistantMessage,
        };

        setCurrentChat(streamingChat);
        updateChatMessages(currentChat.id, assistantMessage);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = [
        ...updatedMessages,
        { role: 'assistant', content: "I'm sorry, something went wrong." },
      ];

      const errorChat = {
        ...currentChat,
        messages: errorMessage,
      };

      setCurrentChat(errorChat);
      updateChatMessages(currentChat.id, errorMessage);
    }
  };
  const handleNewChat = () => {
    const newChat = addNewChat('New Chat');
    setCurrentChat(newChat);
    setCurrentChatId(newChat.id);
    setChats(loadChats());
  };

  function handleSelectChat(chatId: string): void {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setCurrentChat(chat);
      setCurrentChatId(chatId);
    }
    setIsSidebarOpen(false); // Close sidebar on mobile
  }

  // Load chats (keep your existing useEffect hooks)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 p-4 md:p-6">
      <div className="flex h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] gap-4">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
          currentChatId={currentChat?.id}
          chats={chats}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="backdrop-blur-lg bg-white/10 rounded-xl p-4 mb-4 flex justify-between items-center border border-white/20">
            <h1 className="text-xl font-semibold text-white">
              {currentChat?.title || 'New Chat'}
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-all"
              >
                {isSidebarOpen ? <PanelLeftCloseIcon /> : <PanelLeftIcon />}
              </button>
              <UserButton />
            </div>
          </header>
          
          <MessageList messages={currentChat?.messages || []} />
          
          <InputBox
            input={input}
            setInput={setInput}
            onSend={handleSendMessage}
            isSidebarOpen={isSidebarOpen}
          />
        </div>
      </div>
    </div>
  );
}

// Icon for closing the sidebar
function PanelLeftCloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <line x1="15" y1="3" x2="15" y2="21" />
    </svg>
  );
}

// Icon for opening the sidebar
function PanelLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
    </svg>
  );
}

// Keep your icon components