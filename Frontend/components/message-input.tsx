"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"

interface MessageInputProps {
  onSendMessage?: (message: string) => void
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && onSendMessage) {
      onSendMessage(message.trim())
      setMessage("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative">
        <Input
          type="text"
          placeholder="Message Chatbot..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-purple-900/30 border-purple-700 rounded-full py-6 pl-6 pr-12 text-white placeholder:text-gray-400"
        />
        <Button
          type="submit"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 rounded-full h-10 w-10"
          disabled={!message.trim()}
        >
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </form>
  )
}

