import Link from 'next/link';

export function ChatbotType({ type }: { type: string }) {
  return (
    <div className='flex-shrink-0 flex flex-col items-center justify-center px-6 py-6 border-b border-purple-900'>
      <div className='grid grid-cols-4 gap-4 w-full max-w-3xl'>
        <Link
          href='/chatbot/general'
          className={`w-full h-14 flex items-center justify-center text-center px-3 py-2 rounded-full transition-colors text-sm ${
            type === 'general'
              ? 'bg-white text-purple-900'
              : 'bg-purple-900/20 hover:bg-purple-900/40'
          }`}
        >
          General Content
        </Link>
        <Link
          href='/chatbot/sales'
          className={`flex items-center justify-center text-center px-4 py-3 rounded-full transition-colors text-sm ${
            type === 'sales'
              ? 'bg-white text-purple-900'
              : 'bg-purple-900/20 hover:bg-purple-900/40'
          }`}
        >
          Sale Content
        </Link>
        <Link
          href='/chatbot/negotiation'
          className={`flex items-center justify-center text-center px-4 py-3 rounded-full transition-colors text-sm ${
            type === 'negotiation'
              ? 'bg-white text-purple-900'
              : 'bg-purple-900/20 hover:bg-purple-900/40'
          }`}
        >
          Docs Content
        </Link>
        <Link
          href='/chatbot/marketing'
          className={`flex items-center justify-center text-center px-4 py-3 rounded-full transition-colors text-sm ${
            type === 'marketing'
              ? 'bg-white text-purple-900'
              : 'bg-purple-900/20 hover:bg-purple-900/40'
          }`}
        >
          Marketing Content
        </Link>
      </div>
    </div>
  );
}
