"use client"

import { useState } from "react"
import { MessageInput } from "@/components/message-input"
import { ChatMessage } from "@/components/chat-message"
import { MessageSquare, BarChart, FileText, Megaphone } from "lucide-react"

interface Message {
    id: string
    text: string
    isBot: boolean
    timestamp: string
}

interface ChatbotContentProps {
    type: string
}

const chatbotData = {
    general: {
        icon: <MessageSquare className="h-12 w-12 text-white" />,
        title: "General Content Write AI",
        description:
            "Get comprehensive advice on various aspects of real estate, from legalities to client management, tailored to your needs.",
    },
    sales: {
        icon: <BarChart className="h-12 w-12 text-white" />,
        title: "Sales Copywriter AI",
        description:
            "Generate compelling sales copy that converts prospects into customers, with persuasive language tailored to your target audience.",
    },
    negotiation: {
        icon: <FileText className="h-12 w-12 text-white" />,
        title: "Negotiation Document Writer AI",
        description:
            "Create professional negotiation documents that help you secure favorable terms and conditions in any business deal.",
    },
    marketing: {
        icon: <Megaphone className="h-12 w-12 text-white" />,
        title: "Marketing Content AI",
        description:
            "Develop strategic marketing content that resonates with your audience and drives engagement across all channels.",
    },
}

export function ChatbotContent({ type }: ChatbotContentProps) {
    const [messages, setMessages] = useState<Message[]>(() => {
        if (typeof window !== 'undefined') {
            const chatId = new URLSearchParams(window.location.search).get('chat')
            const saved = localStorage.getItem(`chat_${chatId}`)
            return saved ? JSON.parse(saved) : []
        }
        return []
    })
    const data = chatbotData[type as keyof typeof chatbotData]

    const handleSendMessage = async (message: string) => {
        const chatId = new URLSearchParams(window.location.search).get('chat')
        const userMessage: Message = {
            id: Date.now().toString(),
            text: message,
            isBot: false,
            timestamp: new Date().toLocaleTimeString(),
        }

        const updatedMessages = [...messages, userMessage]
        setMessages(updatedMessages)

        // Save to localStorage
        if (chatId) {
            localStorage.setItem(`chat_${chatId}`, JSON.stringify(updatedMessages))

            // Update chat title if this is the first message
            if (messages.length === 0) {
                const savedHistory = localStorage.getItem('chatHistory')
                if (savedHistory) {
                    const history = JSON.parse(savedHistory)
                    const updatedHistory = history.map((chat: any) =>
                        chat.id === chatId ? { ...chat, title: message.slice(0, 30) + (message.length > 30 ? '...' : '') } : chat
                    )
                    localStorage.setItem('chatHistory', JSON.stringify(updatedHistory))
                }
            }
        }

        setTimeout(() => {
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: `This is a sample response from the ${data.title}. In a real application, this would be connected to an AI API.`,
                isBot: true,
                timestamp: new Date().toLocaleTimeString(),
            }
            setMessages((prev) => [...prev, botMessage])
        }, 1000)
    }

    return (
        <section className="flex-1 flex flex-col items-center px-6 py-12 max-w-4xl mx-auto w-full">
            <div className="flex flex-col items-center text-center mb-12">
                <div className="bg-purple-600 p-4 rounded-full mb-6">{data.icon}</div>
                <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
                <p className="text-gray-300 max-w-2xl">{data.description}</p>
            </div>

            <div className="w-full flex-1 flex flex-col overflow-y-auto px-4">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-400 flex-1 flex items-center justify-center">
                        <p>Start a conversation with the AI assistant</p>
                    </div>
                ) : (
                    <div className="space-y-4">                {messages.map((msg) => (
                        <ChatMessage
                            key={msg.id}
                            message={msg.text}
                            isBot={msg.isBot}
                            timestamp={msg.timestamp}
                            onEdit={msg.isBot ? (newMessage) => {
                                setMessages(prev => prev.map(m =>
                                    m.id === msg.id ? { ...m, text: newMessage } : m
                                ))
                            } : undefined}
                        />
                    ))}
                    </div>
                )}
            </div>

            <div className="w-full mt-8">
                <MessageInput onSendMessage={handleSendMessage} />
            </div>
        </section>
    )
}
