'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, MessageSquare, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ChatHistory } from '@/models/ChatHistory';

export function ChatSidebar({ onNewChat }: { onNewChat?: () => void }) {
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('chatHistory');
        return saved ? JSON.parse(saved) : [];
      } catch (error) {
        console.error('Error loading chat history:', error);
        return [];
      }
    }
    return [];
  });
  const pathname = usePathname();
  const currentType = pathname.split('/')[2];

  const createNewChat = () => {
    // Generate a new chat ID
    const chatSessionID = localStorage.getItem('chatSessionId');
    alert(chatSessionID);
    const haveFirstMessageInThisChatSession = localStorage.getItem(
      'haveFirstMessageInThisChatSession'
    );
    if (haveFirstMessageInThisChatSession) {
      const newChatId = Date.now().toString();
      const newChat: ChatHistory = {
        id: newChatId,
        title: 'New Chat',
        type: currentType,
        timestamp: new Date().toLocaleDateString()
      };

      // Update chat history
      const updatedHistory = [newChat, ...chatHistory];
      setChatHistory(updatedHistory);
      localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));

      // Trigger new chat callback
      if (onNewChat) {
        onNewChat();
      }

      // Navigate to a new chat URL
      window.location.href = `/chatbot/${currentType}?chat=${newChatId}`;
      localStorage.removeItem('chatSessionId');
    }
  };

  const deleteChat = (id: string) => {
    const updatedHistory = chatHistory.filter(chat => chat.id !== id);
    setChatHistory(updatedHistory);
    localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
  };

  const updateChatTitle = (id: string, firstMessage: string) => {
    const updatedHistory = chatHistory.map(chat =>
      chat.id === id
        ? {
            ...chat,
            title:
              firstMessage.slice(0, 30) +
              (firstMessage.length > 30 ? '...' : '')
          }
        : chat
    );
    setChatHistory(updatedHistory);
    localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
  };

  return (
    <div className='w-64 bg-gray-900 border-r border-purple-900 flex flex-col h-screen'>
      {/* Header with New Chat button */}
      <div className='p-4 border-b border-purple-900/50'>
        <Button
          className='w-full bg-purple-600 hover:bg-purple-700 text-white gap-2'
          onClick={createNewChat}
        >
          <PlusCircle className='h-4 w-4' />
          New Chat
        </Button>
      </div>

      {/* Chat history - scrollable with custom scrollbar */}
      <div className='flex-1 overflow-y-auto custom-scrollbar'>
        <div className='p-2'>
          <div className='space-y-2'>
            {chatHistory
              .filter(chat => chat.type === currentType)
              .map(chat => (
                <div
                  key={chat.id}
                  className={`group flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-purple-900/20 transition-colors ${
                    pathname.includes(chat.id) ? 'bg-purple-900/30' : ''
                  }`}
                >
                  <MessageSquare className='h-4 w-4 text-gray-400 flex-shrink-0' />
                  <Link
                    href={`/chatbot/${chat.type}?chat=${chat.id}`}
                    className='flex-1 min-w-0 text-sm text-gray-300 hover:text-white'
                  >
                    <div className='truncate'>{chat.title}</div>
                    <div className='text-xs text-gray-500'>
                      {chat.timestamp}
                    </div>
                  </Link>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0'
                    onClick={e => {
                      e.preventDefault();
                      deleteChat(chat.id);
                    }}
                  >
                    <Trash2 className='h-4 w-4 text-gray-400' />
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
