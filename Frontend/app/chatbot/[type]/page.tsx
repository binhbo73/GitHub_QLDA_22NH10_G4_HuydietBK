'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { MessageInput } from '@/components/message-input';
import { ChatMessage } from '@/components/chat-message';
import { MessageSquare, BarChart, FileText, Megaphone } from 'lucide-react';
import { notFound } from 'next/navigation';
import { use } from 'react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: string;
}

interface ChatbotPageProps {
  params: Promise<{ type: string }>;
}

export default function ChatbotPage({ params }: ChatbotPageProps) {
  const { type } = use(params);
  const [messages, setMessages] = useState<Message[]>([]);
  const validTypes = ['general', 'sales', 'negotiation', 'marketing'];

  if (!validTypes.includes(type)) {
    notFound();
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

  const data = chatbotData[type as keyof typeof chatbotData];

  const handleSendMessage = async (message: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isBot: false,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `This is a sample response from the ${data.title}. In a real application, this would be connected to an AI API.`,
        isBot: true,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <main className='min-h-screen flex flex-col'>
      <Navbar />

      <div className='flex flex-col items-center justify-center px-6 py-8 border-b border-purple-900'>
        <div className='grid grid-cols-4 gap-4 w-full max-w-4xl'>
          <Link
            href='/chatbot/general'
            className={`text-center px-4 py-3 rounded-full transition-colors ${
              type === 'general'
                ? 'bg-white text-purple-900'
                : 'bg-purple-900/20 hover:bg-purple-900/40'
            }`}
          >
            General Content Write AI
          </Link>
          <Link
            href='/chatbot/sales'
            className={`text-center px-4 py-3 rounded-full transition-colors ${
              type === 'sales'
                ? 'bg-white text-purple-900'
                : 'bg-purple-900/20 hover:bg-purple-900/40'
            }`}
          >
            Sale Copy Writer AI
          </Link>
          <Link
            href='/chatbot/negotiation'
            className={`text-center px-4 py-3 rounded-full transition-colors ${
              type === 'negotiation'
                ? 'bg-white text-purple-900'
                : 'bg-purple-900/20 hover:bg-purple-900/40'
            }`}
          >
            Negotiation Document Writer AI
          </Link>
          <Link
            href='/chatbot/marketing'
            className={`text-center px-4 py-3 rounded-full transition-colors ${
              type === 'marketing'
                ? 'bg-white text-purple-900'
                : 'bg-purple-900/20 hover:bg-purple-900/40'
            }`}
          >
            Marketing Content AI
          </Link>
        </div>
      </div>

      <section className='flex-1 flex flex-col items-center px-6 py-12 max-w-4xl mx-auto w-full'>
        <div className='flex flex-col items-center text-center mb-12'>
          <div className='bg-purple-600 p-4 rounded-full mb-6'>{data.icon}</div>
          <h1 className='text-3xl font-bold mb-4'>{data.title}</h1>
          <p className='text-gray-300 max-w-2xl'>{data.description}</p>
        </div>

        <div className='w-full flex-1 flex flex-col overflow-y-auto px-4'>
          {messages.length === 0 ? (
            <div className='text-center text-gray-400 flex-1 flex items-center justify-center'>
              <p>Start a conversation with the AI assistant</p>
            </div>
          ) : (
            <div className='space-y-4'>
              {messages.map(msg => (
                <ChatMessage
                  key={msg.id}
                  message={msg.text}
                  isBot={msg.isBot}
                  timestamp={msg.timestamp}
                />
              ))}
            </div>
          )}
        </div>

        <div className='w-full mt-8'>
          <MessageInput onSendMessage={handleSendMessage} />
        </div>
      </section>
    </main>
  );
}
