interface ChatMessageProps {
  message: string
  isBot?: boolean
  timestamp?: string
}

export function ChatMessage({ message, isBot = false, timestamp }: ChatMessageProps) {
  return (
    <div className={`flex ${isBot ? "justify-start" : "justify-end"} mb-4`}>
      <div className={`max-w-[80%] ${isBot ? "order-2" : "order-1"}`}>
        <div className={`rounded-2xl px-4 py-2 ${isBot ? "bg-purple-900/30 text-white" : "bg-purple-600 text-white"}`}>
          <p className="text-sm">{message}</p>
        </div>
        {timestamp && <p className="text-xs text-gray-400 mt-1">{timestamp}</p>}
      </div>
    </div>
  )
}

