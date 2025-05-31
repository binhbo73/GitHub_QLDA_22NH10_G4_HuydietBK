import { Suspense } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { ChatbotContent } from '@/components/chatbot-content';
import { ChatSidebar } from '@/components/chat-sidebar';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

const validTypes = ['general', 'sales', 'negotiation', 'marketing'];

interface PageProps {
  params: Promise<{
    type: string;
  }>;
}

// Server Component for metadata generation
export async function generateMetadata({
  params
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;

  if (!validTypes.includes(resolvedParams.type)) {
    notFound();
  }

  return {
    title: `${
      resolvedParams.type.charAt(0).toUpperCase() + resolvedParams.type.slice(1)
    } Chatbot`
  };
}

// Client Component for interactive elements
function ChatbotPageClient({ type }: { type: string }) {
  return (
    <div className='flex h-screen overflow-hidden'>
      {/* Sidebar - fixed position */}
      <div className='flex-shrink-0'>
        <ChatSidebar />
      </div>

      {/* Main content area */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Navbar - fixed at top */}
        <div className='flex-shrink-0'>
          <Navbar />
        </div>

        {/* Navigation tabs - fixed */}
        <div className='flex-shrink-0 flex flex-col items-center justify-center px-6 py-6 border-b border-purple-900'>
          <div className='grid grid-cols-4 gap-4 w-full max-w-4xl'>
            <Link
              href='/chatbot/general'
              className={`text-center px-4 py-3 rounded-full transition-colors text-sm ${
                type === 'general'
                  ? 'bg-white text-purple-900'
                  : 'bg-purple-900/20 hover:bg-purple-900/40'
              }`}
            >
              General Content Write AI
            </Link>
            <Link
              href='/chatbot/sales'
              className={`text-center px-4 py-3 rounded-full transition-colors text-sm ${
                type === 'sales'
                  ? 'bg-white text-purple-900'
                  : 'bg-purple-900/20 hover:bg-purple-900/40'
              }`}
            >
              Sale Copy Writer AI
            </Link>
            <Link
              href='/chatbot/negotiation'
              className={`text-center px-4 py-3 rounded-full transition-colors text-sm ${
                type === 'negotiation'
                  ? 'bg-white text-purple-900'
                  : 'bg-purple-900/20 hover:bg-purple-900/40'
              }`}
            >
              Negotiation Document Writer AI
            </Link>
            <Link
              href='/chatbot/marketing'
              className={`text-center px-4 py-3 rounded-full transition-colors text-sm ${
                type === 'marketing'
                  ? 'bg-white text-purple-900'
                  : 'bg-purple-900/20 hover:bg-purple-900/40'
              }`}
            >
              Marketing Content AI
            </Link>
          </div>
        </div>

        {/* Chat content - scrollable area */}
        <div className='flex-1 overflow-hidden'>
          <ChatbotContent type={type} />
        </div>
      </div>
    </div>
  );
}

// Server Component (default export)
export default async function ChatbotPage({ params }: PageProps) {
  const resolvedParams = await params;
  const type = resolvedParams.type;

  if (!validTypes.includes(type)) {
    notFound();
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatbotPageClient type={type} />
    </Suspense>
  );
}
