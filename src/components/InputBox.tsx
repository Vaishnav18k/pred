export default function InputBox({
  input,
  setInput,
  onSend,
  isSidebarOpen,
  isLoading = false,
}: {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  isSidebarOpen: boolean;
  isLoading?: boolean;
}) {
  return (
    <div className="backdrop-blur-lg bg-white/10 rounded-xl p-4 border border-white/20 mt-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSend()}
          placeholder="Type your message..."
          className="flex-1 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
        />
        <button
      onClick={onSend}
      disabled={!input.trim() || isLoading}
      className="backdrop-blur-sm bg-blue-500/80 hover:bg-blue-500 text-white px-4 py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
    >
      {isLoading ? (
<Spinner />
) : (
        <PaperAirplaneIcon className="w-5 h-5" />
      )}
    </button>
      </div>
      <p className="text-xs text-white/50 mt-2 text-center">
        AI can make mistakes. Consider checking important information.
      </p>
    </div>
  );
}

function PaperAirplaneIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
    </svg>
  );
}
// Add spinner component
function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}