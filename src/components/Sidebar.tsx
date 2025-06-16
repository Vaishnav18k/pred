function PanelLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
    </svg>
  );
}

function PanelLeftCloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <line x1="15" y1="3" x2="15" y2="21" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
// components/Sidebar.tsx

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1.5 14.5a2 2 0 0 1-2 1.5H8.5a2 2 0 0 1-2-1.5L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
// Define the SidebarProps interface
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
  currentChatId?: string | null;
  chats?: Array<{ id: string; title: string }>;
  onSelectChat?: (chatId: string) => void;
  onNewChat?: () => void;
  onDeleteChat?: (chatId: string) => void;
}

export default function Sidebar({
  isOpen,
  onClose,
  onToggle,
  selectedModel,
  onSelectModel,
  currentChatId,
  chats = [],
  onSelectChat = () => {},
  onNewChat = () => {},
  onDeleteChat = () => {}, 
  // default empty function
}: SidebarProps) {
  
  return (
    <aside className={`
  backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl 
  flex flex-col transition-all duration-300 ease-in-out overflow-hidden 
  ${isOpen ? "w-80 opacity-100" : "w-16 opacity-90"}
`}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/20">
        {isOpen && <h2 className="text-lg font-semibold text-white">My Chats</h2>}
        <button
          onClick={onToggle}
          className="p-1 rounded-lg backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-colors"
        >
          {isOpen ? <PanelLeftCloseIcon /> : <PanelLeftIcon />}
        </button>
      </div>

      {/* Model Selection */}
      {isOpen && (
        <div className="px-4 py-3 border-b border-white/20">
          <label className="block text-sm font-medium mb-1 text-white/80">
            AI Model
          </label>
<select
  value={selectedModel}
  onChange={(e) => onSelectModel(e.target.value)}
  className="w-full backdrop-blur-sm bg-white/10 text-white rounded-lg px-3 py-2 text-sm border border-white/20 focus:ring-2 focus:ring-white/50 focus:outline-none
             [&>option]:text-black"
>
  <option value="gemma2-9b-it">Gemma 2.9B</option>
  <option value="mistral-large-latest">Mistral Large</option>
  <option value="gemini-1.5-flash">Gemini Flash</option>
</select>
        </div>
      )}

      {/* Chat List */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`group flex items-center p-2 rounded-lg cursor-pointer transition-all ${
              currentChatId === chat.id 
                ? 'backdrop-blur-sm bg-white/20' 
                : 'hover:bg-white/10'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white/80"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {isOpen && (
              <>
                <span className="ml-2 truncate text-white">{chat.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                     onDeleteChat(chat.id);
                    // Add delete functionality
                  }}
                  className="ml-auto text-white/40 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <TrashIcon />
                </button>
              </>
            )}
          </div>
        ))}
      </nav>

      {/* New Chat Button */}
      <div className="p-3 border-t border-white/20">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 backdrop-blur-sm bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg transition-all"
        >
          <PlusIcon />
          {isOpen && <span>New Chat</span>}
        </button>
      </div>
    </aside>
  );
}