'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageInput } from '@/components/message-input';
import { ChatMessage } from '@/components/chat-message';
import { MessageSquare, BarChart, FileText, Megaphone } from 'lucide-react';
import type { Message } from '@/models/Message';
import { getQAFromChatSessionId, handleQA } from '@/lib/qa';
import { get } from 'http';
import { QAPair } from '@/models/QAPair';
import { useSearchParams } from 'next/navigation';

interface ChatbotContentProps {
  type: string;
}

const chatbotData = {
  general: {
    icon: <MessageSquare className='h-12 w-12 text-white' />,
    title: 'General Content Write AI',
    description:
      'Get comprehensive advice on various aspects of real estate, from legalities to client management, tailored to your needs.'
  },
  sales: {
    icon: <BarChart className='h-12 w-12 text-white' />,
    title: 'Sales Copywriter AI',
    description:
      'Generate compelling sales copy that converts prospects into customers, with persuasive language tailored to your target audience.'
  },
  negotiation: {
    icon: <FileText className='h-12 w-12 text-white' />,
    title: 'Negotiation Document Writer AI',
    description:
      'Create professional negotiation documents that help you secure favorable terms and conditions in any business deal.'
  },
  marketing: {
    icon: <Megaphone className='h-12 w-12 text-white' />,
    title: 'Marketing Content AI',
    description:
      'Develop strategic marketing content that resonates with your audience and drives engagement across all channels.'
  }
};

export function ChatbotContent({ type }: ChatbotContentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const chatId = useSearchParams().get('chat')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!chatId) {
        setMessages([]);
        localStorage.removeItem('chatSessionId');
        return;
      }
      localStorage.setItem('chatSessionId', chatId);
      const saved = localStorage.getItem(`chat_${chatId}`);
      if (saved) {
        setMessages(JSON.parse(saved));
        return;
      }
      getQAFromChatSessionId(chatId).then((qaPairs: QAPair[]) => {
        const msgs = [] as Message[];
        qaPairs.forEach((pair: QAPair) => {
          msgs.push({
            id: pair.id,
            text: pair.question,
            isBot: false,
            timestamp: new Date(pair.created_at).toLocaleTimeString()
          });
          msgs.push({
            id: pair.id + '_response',
            text: pair.answer,
            isBot: true,
            timestamp: new Date(pair.created_at).toLocaleTimeString()
          });
        });
        // Save to localStorage
        localStorage.setItem(`chat_${chatId}`, JSON.stringify(msgs));
        setMessages(msgs || []);
      });
    }
  }, [chatId]);

  // Ref for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const data = chatbotData[type as keyof typeof chatbotData];

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    const chatId = new URLSearchParams(window.location.search).get('chat');
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isBot: false,
      timestamp: new Date().toLocaleTimeString()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Save to localStorage
    if (chatId) {
      localStorage.setItem(`chat_${chatId}`, JSON.stringify(updatedMessages));

      // Update chat title if this is the first message
      if (messages.length === 0) {
        const savedHistory = localStorage.getItem('chatHistory');
        if (savedHistory) {
          const history = JSON.parse(savedHistory);
          const updatedHistory = history.map((chat: any) =>
            chat.id === chatId
              ? {
                  ...chat,
                  title:
                    message.slice(0, 30) + (message.length > 30 ? '...' : '')
                }
              : chat
          );
          localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
        }
      }
    }

    setTimeout(async () => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `This is a sample response from the ${data.title}. In a real application, this would be connected to an AI API.`,
        isBot: true,
        timestamp: new Date().toLocaleTimeString()
      };
      const botAnswer = await handleQA(message);
      const botResponse: Message = {
        id: (Date.now() + 2).toString(),
        text: botAnswer,
        isBot: true,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => {
        const newMessages = [...prev, botResponse];
        // Save updated messages with bot response
        if (chatId) {
          localStorage.setItem(`chat_${chatId}`, JSON.stringify(newMessages));
        }
        return newMessages;
      });
    }, 1000);
  };

  return (
    <div className='flex-1 flex flex-col h-full'>
      {/* Header section - fixed */}
      {/* <div className='flex flex-col items-center text-center py-8 px-6 border-b border-purple-900/30'>
        <div className='bg-purple-600 p-4 rounded-full mb-4'>{data.icon}</div>
        <h1 className='text-2xl font-bold mb-2'>{data.title}</h1>
        <p className='text-gray-300 max-w-2xl text-sm'>{data.description}</p>
      </div> */}

      <div
        ref={chatContainerRef}
        className='flex-1 overflow-y-auto custom-scrollbar'
      >
        {messages.length === 0 ? (
          <div className='h-full flex items-center justify-center'>
            <p className='text-center text-gray-400'>
              Start a conversation with the AI assistant
            </p>
          </div>
        ) : (
          <div className='space-y-4 max-w-4xl mx-auto'>
            {messages.map(msg => (
              <ChatMessage
                key={msg.id}
                message={msg.text}
                isBot={msg.isBot}
                timestamp={msg.timestamp}
                onEdit={
                  msg.isBot
                    ? newMessage => {
                        setMessages(prev =>
                          prev.map(m =>
                            m.id === msg.id ? { ...m, text: newMessage } : m
                          )
                        );
                      }
                    : undefined
                }
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className='border-t border-purple-900/30 p-4'>
        <div className='max-w-4xl mx-auto'>
          <MessageInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}
