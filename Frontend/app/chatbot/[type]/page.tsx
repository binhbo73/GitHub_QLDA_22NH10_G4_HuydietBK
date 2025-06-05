import { Suspense } from 'react';
import { Navbar } from '@/components/navbar';
import { ChatbotContent } from '@/components/chatbot-content';
import { ChatSidebar } from '@/components/chat-sidebar';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ChatbotType } from '@/components/chatbot-type';

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
      <div className='flex-shrink-0'>
        <ChatSidebar />
      </div>

      <div className='flex-1 flex flex-col overflow-hidden'>
        <div className='flex-shrink-0 mb-4'>
          <Navbar />
        </div>

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
