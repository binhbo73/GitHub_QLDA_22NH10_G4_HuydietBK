import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { ChatbotCard } from "@/components/chatbot-card"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-purple-400 mb-6">
          Elevate Your Content Strategy With
          <br />
          AI-Powered Creativity!
        </h1>

        <p className="text-lg text-gray-300 mb-8 max-w-3xl">
          Enhance Your Content Creation Process With AI-Powered Tools Specialized In Writing, SEO, Marketing, And More
        </p>

        <Link href="/services">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-full">
            GET STARTED
          </Button>
        </Link>

        <div className="w-full mt-20">
          <h2 className="text-2xl font-bold mb-8">Explore AI Chatbots</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ChatbotCard type="general" />
            <ChatbotCard type="sales" />
            <ChatbotCard type="negotiation" />
            <ChatbotCard type="marketing" />
          </div>
        </div>
      </section>
    </main>
  )
}

