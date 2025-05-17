import { Navbar } from "@/components/navbar"
import { ChatbotCard } from "@/components/chatbot-card"

export default function ServicesPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <section className="flex-1 flex flex-col items-center px-6 py-12 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Explore AI Chatbots</h1>

        <p className="text-center text-gray-300 mb-12 max-w-3xl">
          Engage With Our AI Chatbots To Receive Expert Guidance Tailored To Your Needs In Sales, Negotiation,
          Marketing, And More.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          <ChatbotCard type="general" />
          <ChatbotCard type="sales" />
          <ChatbotCard type="negotiation" />
          <ChatbotCard type="marketing" />
        </div>
      </section>
    </main>
  )
}

