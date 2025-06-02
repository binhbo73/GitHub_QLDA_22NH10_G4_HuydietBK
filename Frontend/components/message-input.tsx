'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Mic, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface MessageInputProps {
  onSendMessage?: (message: string) => void;
}

const AI_MODELS = [
  { id: 'deepseek', name: 'deepseek' }
  // { id: 'gpt-3.5', name: 'GPT-3.5' },
  // { id: 'gpt-4', name: 'GPT-4' },
  // { id: 'claude', name: 'Claude' },
  // { id: 'github-copilot', name: 'GitHub Copilot' }
];

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && onSendMessage) {
      onSendMessage(message.trim());
      setMessage('');
      localStorage.setItem('haveFirstMessageInThisChatSession', 'true');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='w-full max-w-3xl mx-auto'>
      <div className='flex items-center gap-2'>
        <div className='relative flex-1'>
          <Input
            type='text'
            placeholder='Message Chatbot...'
            value={message}
            onChange={e => setMessage(e.target.value)}
            className='w-full bg-purple-900/30 border-purple-700 rounded-full py-6 pl-6 pr-32 text-white placeholder:text-gray-400'
          />
          <div className='absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1'>
            <Button
              type='button'
              size='icon'
              onClick={() => setIsRecording(!isRecording)}
              className={`rounded-full h-10 w-10 ${
                isRecording
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-purple-600/50 hover:bg-purple-600'
              }`}
            >
              <Mic className='h-5 w-5' />
            </Button>
            <Button
              type='submit'
              size='icon'
              className='bg-purple-600 hover:bg-purple-700 rounded-full h-10 w-10'
              disabled={!message.trim()}
            >
              <ArrowRight className='h-5 w-5' />
            </Button>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='outline'
              className='bg-purple-900/30 border-purple-700 text-white hover:bg-purple-900/50'
            >
              {selectedModel.name}
              <ChevronDown className='ml-2 h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='bg-purple-900 border-purple-700'>
            {AI_MODELS.map(model => (
              <DropdownMenuItem
                key={model.id}
                onClick={() => setSelectedModel(model)}
                className='text-white hover:bg-purple-800'
              >
                {model.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </form>
  );
}
