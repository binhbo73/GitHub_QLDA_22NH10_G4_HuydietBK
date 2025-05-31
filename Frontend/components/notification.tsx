'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Info, X, XCircle } from 'lucide-react';

type NotificationProps = {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  duration?: number;
};

const Notification: React.FC<NotificationProps> = ({
  message,
  type = 'info',
  onClose,
  duration = 3000
}) => {
  const [progress, setProgress] = useState(100);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      // Animation for progress bar
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);

        if (remaining <= 0) {
          clearInterval(interval);
          setIsVisible(false);
          setTimeout(() => onClose(), 300); // Allow exit animation to complete
        }
      }, 16);

      return () => clearInterval(interval);
    }
  }, [duration, onClose]);

  const typeConfig = {
    success: {
      icon: <CheckCircle className='h-5 w-5' />,
      style:
        'bg-gradient-to-r from-emerald-500 to-green-500 text-white border-l-4 border-emerald-700',
      progressColor: 'bg-emerald-300'
    },
    error: {
      icon: <XCircle className='h-5 w-5' />,
      style:
        'bg-gradient-to-r from-red-500 to-rose-500 text-white border-l-4 border-red-700',
      progressColor: 'bg-red-300'
    },
    warning: {
      icon: <AlertCircle className='h-5 w-5' />,
      style:
        'bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 border-l-4 border-amber-600',
      progressColor: 'bg-amber-300'
    },
    info: {
      icon: <Info className='h-5 w-5' />,
      style:
        'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-l-4 border-blue-700',
      progressColor: 'bg-blue-300'
    }
  };

  const { icon, style, progressColor } = typeConfig[type];

  return (
    <div
      className={`fixed top-4 right-4 max-w-sm w-full rounded-lg shadow-xl 
      ${style} transform transition-all duration-300 ease-out
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
    >
      <div className='p-4'>
        <div className='flex items-center'>
          <div className='flex-shrink-0'>{icon}</div>
          <div className='ml-3 flex-1 pr-8'>
            <p className='text-sm font-medium'>{message}</p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className='absolute top-3 right-3 rounded-full p-1 hover:bg-black/10 transition-colors'
            aria-label='Close notification'
          >
            <X className='h-4 w-4' />
          </button>
        </div>
      </div>

      <div className='h-1 w-full bg-black/10 rounded-b-lg overflow-hidden'>
        <div
          className={`h-full ${progressColor} transition-all duration-100 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default Notification;
