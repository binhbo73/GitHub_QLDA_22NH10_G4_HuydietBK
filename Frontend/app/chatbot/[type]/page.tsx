'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { MessageInput } from '@/components/message-input';
import { ChatMessage } from '@/components/chat-message';
import { MessageSquare, BarChart, FileText, Megaphone } from 'lucide-react';
import { notFound } from 'next/navigation';
import { use } from 'react';
import { Message } from '@/models/Message';

interface ChatbotPageProps {
  params: Promise<{ type: string }>;
import { Suspense } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { ChatbotContent } from "@/components/chatbot-content"
import { ChatSidebar } from "@/components/chat-sidebar"
import { notFound } from "next/navigation"

const validTypes = ["general", "sales", "negotiation", "marketing"]

interface PageProps {
  params: Promise<{
    type: string
  }>
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params

  if (!validTypes.includes(resolvedParams.type)) {
    notFound()
  }

  return {
    title: `${resolvedParams.type.charAt(0).toUpperCase() + resolvedParams.type.slice(1)} Chatbot`
  }
}

export default async function ChatbotPage({ params }: PageProps) {
  const resolvedParams = await params
  const type = resolvedParams.type

  if (!validTypes.includes(type)) {
    notFound()
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex h-screen">
        <ChatSidebar />
        <main className="flex-1 flex flex-col">
          <Navbar />
          <div className="flex flex-col items-center justify-center px-6 py-8 border-b border-purple-900">
            <div className="grid grid-cols-4 gap-4 w-full max-w-4xl">
              <Link
                href="/chatbot/general"
                className={`text-center px-4 py-3 rounded-full transition-colors ${type === "general" ? "bg-white text-purple-900" : "bg-purple-900/20 hover:bg-purple-900/40"}`}
              >
                General Content Write AI
              </Link>
              <Link
                href="/chatbot/sales"
                className={`text-center px-4 py-3 rounded-full transition-colors ${type === "sales" ? "bg-white text-purple-900" : "bg-purple-900/20 hover:bg-purple-900/40"}`}
              >
                Sale Copy Writer AI
              </Link>
              <Link
                href="/chatbot/negotiation"
                className={`text-center px-4 py-3 rounded-full transition-colors ${type === "negotiation" ? "bg-white text-purple-900" : "bg-purple-900/20 hover:bg-purple-900/40"}`}
              >
                Negotiation Document Writer AI
              </Link>
              <Link
                href="/chatbot/marketing"
                className={`text-center px-4 py-3 rounded-full transition-colors ${type === "marketing" ? "bg-white text-purple-900" : "bg-purple-900/20 hover:bg-purple-900/40"}`}
              >
                Marketing Content AI
              </Link>
            </div>
          </div>
          <ChatbotContent type={type} />
        </main>
      </div>
    </Suspense>
  )
}