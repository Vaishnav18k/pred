
// components/MessageList.tsx
export default function MessageList({ messages }: { messages: any[] }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="backdrop-blur-lg bg-white/10 p-8 rounded-xl max-w-md border border-white/20">
            <h3 className="text-xl font-medium text-white mb-2">Start a conversation</h3>
            <p className="text-white/70">Ask anything to your AI assistant</p>
          </div>
        </div>
      ) : (
        messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-xl p-4 ${
                msg.role === 'user'
                  ? 'backdrop-blur-sm bg-blue-500/20 border border-blue-400/30'
                  : 'backdrop-blur-sm bg-white/10 border border-white/20'
              }`}
            >
              <p className="text-white">{msg.content}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}