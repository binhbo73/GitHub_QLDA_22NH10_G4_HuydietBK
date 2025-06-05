'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Check, Share2, Volume2, Pause } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import React from 'react';
import { handleSaveEditedMessage } from '@/lib/qa';
import { text } from 'stream/consumers';
import { textToSpeech } from '@/lib/audio';

interface ChatMessageProps {
  message: string;
  isBot?: boolean;
  timestamp?: string;
  onEdit?: (newMessage: string) => void;
}

export function ChatMessage({
  message,
  isBot = false,
  timestamp,
  onEdit
}: ChatMessageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(message);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);

  const handleSave = () => {
    if (onEdit) {
      onEdit(editedMessage);
    }

    setIsEditing(false);
  };

  const handleSpeak = async () => {
    if (isSpeaking && audioObj) {
      audioObj.pause();
      audioObj.currentTime = 0;
      setIsSpeaking(false);
      return;
    }

    try {
      const result = await textToSpeech(editedMessage);
      const url = result.audio_url;
      if (!url) {
        console.error('No audio URL returned from textToSpeech');
        return;
      }
      const audio = new Audio(url);

      audio.play();
      setAudioObj(audio);
      setIsSpeaking(true);

      audio.onended = () => setIsSpeaking(false);
    } catch (error) {
      console.error('Error in textToSpeech:', error);
    }
  }

  return (
    <div
      className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4 group`}
    >
      <div className={`max-w-[80%] ${isBot ? 'order-2' : 'order-1'} relative`}>
        <div
          className={`rounded-2xl px-4 py-2 ${
            isBot ? 'bg-purple-900/30 text-white' : 'bg-purple-600 text-white'
          } ${isEditing ? 'min-w-[500px]' : ''}`}
        >
          {isEditing && isBot ? (
            <div className='relative'>
              <textarea
                value={editedMessage}
                onChange={e => {
                  setEditedMessage(e.target.value);
                  // Auto-adjust height
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
                className='w-full bg-transparent text-white border border-purple-500 rounded p-2 focus:outline-none focus:border-purple-400 min-h-[100px] resize-none overflow-hidden'
                autoFocus
                style={{ height: 'auto' }}
              />
            </div>
          ) : (
            // <p className='text-sm whitespace-pre-wrap break-words'>{message}</p>
            <ReactMarkdown>{message}</ReactMarkdown>
          )}
        </div>
        {timestamp && <p className='text-xs text-gray-400 mt-1'>{timestamp}</p>}

        {isBot && (
          <div className='absolute right-0 top-0 -mr-12 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2'>
            <Button
              size='icon'
              variant='ghost'
              className='h-8 w-8 bg-purple-600/20 hover:bg-purple-600/40'
              onClick={() => {
                const text = message;
                const url =
                  'https://www.facebook.com/sharer/sharer.php?u=' +
                  encodeURIComponent(window.location.href) +
                  '&quote=' +
                  encodeURIComponent(text);
                window.open(url, '_blank', 'width=700,height=500');
              }}
            >
              <Share2 className='h-4 w-4' />
            </Button>
            {isEditing ? (
              <Button
                size='icon'
                variant='ghost'
                className='h-8 w-8 bg-purple-600/20 hover:bg-purple-600/40'
                onClick={handleSave}
              >
                <Check className='h-4 w-4' />
              </Button>
            ) : (
              <Button
                size='icon'
                variant='ghost'
                className='h-8 w-8 bg-purple-600/20 hover:bg-purple-600/40'
                onClick={() => setIsEditing(true)}
              >
                <Pencil className='h-4 w-4' />
              </Button>
            )}
            <Button
              size='icon'
              variant='ghost'
              className='h-8 w-8 bg-purple-600/20 hover:bg-purple-600/40'
              onClick={handleSpeak}
            >
              {isSpeaking ? (
                <Pause className='h-4 w-4' />
              ) : (
                <Volume2 className='h-4 w-4' />
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
